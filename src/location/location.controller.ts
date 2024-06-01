import { Controller, Post, Body } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('location')
@ApiTags('Location')
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create location',
  })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Create multiple locations',
  })
  createBulk(@Body() createLocationDto: CreateLocationDto[]) {
    return this.locationService.createBulk(createLocationDto);
  }
}
