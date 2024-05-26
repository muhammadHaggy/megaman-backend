import { Module } from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { TrackersController } from './trackers.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TrackersController],
  providers: [TrackersService, PrismaService]
})
export class TrackersModule {}
