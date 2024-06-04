import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as sharp from 'sharp';

@Injectable()
export class AssetsService {
  constructor(private prismaService: PrismaService) {}
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
    const buffer = await sharp(file.buffer)
      .resize(150, 150)
      .jpeg({ quality: 75 })
      .toBuffer();

    return this.prismaService.asset.update({
      where: { id: assetId },
      data: {
        image: buffer,
      },
    });
  }
}
