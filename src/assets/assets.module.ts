import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, PrismaService],
})
export class AssetsModule {}
