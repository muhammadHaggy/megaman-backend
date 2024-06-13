import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Storage } from '@google-cloud/storage';
import * as sharp from 'sharp';
import * as qrcode from 'qrcode';

@Injectable()
export class AssetsService {
  constructor(private prismaService: PrismaService) {}
  private storage = new Storage();
  private bucket = this.storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

  async create(createAssetDto: CreateAssetDto, userId: number) {
    const data = {
      ...createAssetDto,
      ownerId: userId,
    };

    if (createAssetDto.trackerId != null) {
      const tracker = await this.checkTrackerId(createAssetDto.trackerId);
      data.trackerId = tracker.id;
    }

    return this.prismaService.asset.create({
      data,
    });
  }

  private async checkTrackerId(id?: number) {
    const tracker = await this.prismaService.tracker.findUnique({
      where: { id },
    });
    if (!tracker) {
      throw new NotFoundException(`Tracker with id ${id} not found`);
    }

    return tracker;
  }

  findAll() {
    return this.prismaService.asset.findMany();
  }

  findOne(id: number) {
    return this.prismaService.asset.findUnique({
      where: { id },
    });
  }

  findAssetsWithoutTracker() {
    return this.prismaService.asset.findMany({
      where: {
        trackerId: null,
      },
    });
  }

  findAssetsWithTracker() {
    return this.prismaService.asset.findMany({
      where: {
        trackerId: {
          not: null,
        },
      },
    });
  }

  findApprovedAssets() {
    return this.prismaService.asset.findMany({
      where: {
        isApproved: true,
      },
    });
  }

  findUnapprovedAssets() {
    return this.prismaService.asset.findMany({
      where: {
        isApproved: false,
      },
    });
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return this.prismaService.asset.update({
      where: { id },
      data: updateAssetDto,
    });
  }

  async approve(id: number) {
    // Generate QR and then update Asset model
    try {
      const qrCodeResult = await this.generateQR(id);
      return await this.prismaService.asset.update({
        where: { id },
        data: {
          isApproved: true,
          qrCode: qrCodeResult,
        },
      });
    } catch (err) {
      console.error('Error approving asset:', err);
      throw err;
    }
  }

  remove(id: number) {
    return this.prismaService.asset.delete({
      where: { id },
    });
  }

  private async uploadToGCS(
    filename: string,
    buffer: Buffer,
    contentType: string
  ): Promise<string> {
    const blob = this.bucket.file(filename);
    const blobStream = blob.createWriteStream({
      resumable: false, // assume the file is not large
      metadata: {
        contentType,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${filename}`;
        resolve(publicUrl);
      });
      blobStream.on('error', (err) => {
        console.error('Error uploading file to Google Cloud Storage:', err);
        reject(err);
      });
      blobStream.end(buffer);
    });
  }

  async uploadImage(assetId: number, file: Express.Multer.File) {
    const filename = `images/${assetId}-${file.originalname}`;
    const contentType = file.mimetype;

    try {
      // Compress image
      const imageBuffer = await sharp(file.buffer)
        .resize(150, 150)
        .jpeg({ quality: 75 })
        .toBuffer();

      const imageURL = await this.uploadToGCS(
        filename,
        imageBuffer,
        contentType
      );
      return this.prismaService.asset.update({
        where: { id: assetId },
        data: {
          imageURL: imageURL,
        },
      });
    } catch (err) {
      console.error('Error processing file:', err);
      throw err;
    }
  }

  async generateQR(assetId: number): Promise<string> {
    const asset = await this.findOne(assetId);
    const filename = `qr/${assetId}`;
    asset.qrCode = `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${filename}`;
    const content = JSON.stringify(asset, (key, value) => {
      // Remove unnecesary properties from the JSON
      if (key === 'createdAt') {
        return undefined;
      }

      if (key === 'updatedAt') {
        return undefined;
      }

      if (key === 'owner') {
        return undefined;
      }

      if (key === 'ownerId') {
        return undefined;
      }

      if (key === 'isApproved') {
        return undefined;
      }
      return value;
    });

    try {
      const qrCodeBuffer = await qrcode.toBuffer(content, {
        type: 'image/png',
        width: 150,
      });
      return await this.uploadToGCS(filename, qrCodeBuffer, 'image/png');
    } catch (err) {
      console.error('Error generating QR code:', err);
      throw err;
    }
  }
}
