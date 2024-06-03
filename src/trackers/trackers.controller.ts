import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/interfaces/pagination/page-options.dto';

@Controller('trackers')
@ApiTags('Trackers')
@ApiBearerAuth()
export class TrackersController {
  constructor(private readonly trackersService: TrackersService) {}

  @Get('current-locations')
  getCurrentLocations() {
    return this.trackersService.getCurrentLocations();
  }

  @Post()
  create(@Body() createTrackerDto: CreateTrackerDto) {
    return this.trackersService.create(createTrackerDto);
  }

  @Get()
  findAll() {
    return this.trackersService.findAll();
  }

  @Get('history/:trackerId')
  getTrackerLocationsHistory(
    @Param('trackerId') trackerId: number,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    return this.trackersService.getTrackerLocationsHistoryQuery(
      +trackerId,
      pageOptionsDto
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackerDto: UpdateTrackerDto) {
    return this.trackersService.update(+id, updateTrackerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackersService.remove(+id);
  }
}
