import { Module } from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { TrackersController } from './trackers.controller';

@Module({
  controllers: [TrackersController],
  providers: [TrackersService],
})
export class TrackersModule {}
