import { Injectable } from '@nestjs/common';
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

  create(createAssetDto: CreateAssetDto, userId: number) {
    return this.prismaService.asset.create({
      data: {
        ...createAssetDto,
        ownerId: userId,
      },
    });
  }

  findAll() {
    return this.prismaService.asset.findMany();
  }

  findOne(id: number) {
    return this.prismaService.asset.findUnique({
      where: { id },
    });
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return this.prismaService.asset.update({
      where: { id },
      data: updateAssetDto,
    });
  }

  approve(id: number) {
    // Generate QR and then update Asset model
    return this.generateQR(id)
      .then((qrCodeResult) =>
        this.prismaService.asset.update({
          where: { id },
          data: {
            isApproved: true,
            qrCode: qrCodeResult,
          },
        })
      )
      .catch((err) => {
        console.error('Error approving asset:', err);
        throw err;
      });
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
    const content = `${assetId}`;
    const filename = `qr/${assetId}`;

    try {
      const qrCodeBuffer = await qrcode.toBuffer(content, {
        type: 'image/png',
      });
      return await this.uploadToGCS(filename, qrCodeBuffer, 'image/png');
    } catch (err) {
      console.error('Error generating QR code:', err);
      throw err;
    }
  }

  async getAssetsWithoutTracker() {
    return this.prismaService.asset.findMany({
      where: {
        tracker: {
          is: null,
        },
      },
    });
  }

  async getAssetsWithTracker() {
    return this.prismaService.asset.findMany({
      where: {
        tracker: {
          isNot: null,
        },
      },
    });
  }
}
