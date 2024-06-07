import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Storage } from '@google-cloud/storage';
import * as sharp from 'sharp';

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

  remove(id: number) {
    return this.prismaService.asset.delete({
      where: { id },
    });
  }

  async uploadImage(assetId: number, file: Express.Multer.File) {
    console.log(file);
    const destination = String(assetId);
    const contentType = file.mimetype;

    try {
      // Process the image using sharp
      const buffer = await sharp(file.buffer)
        .resize(150, 150)
        .jpeg({ quality: 75 })
        .toBuffer();

      // Create a blob in the bucket and upload the buffer
      const blob = this.bucket.file(destination);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType,
        },
      });

      return new Promise((resolve, reject) => {
        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${assetId}`;
          resolve({ url: publicUrl });
        });

        blobStream.on('error', (err) => {
          console.error('Error uploading file to Google Cloud Storage:', err);
        });

        blobStream.end(buffer);
      });
    } catch (err) {
      console.error('Error processing file:', err);
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
