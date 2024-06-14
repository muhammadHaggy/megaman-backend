import { Injectable } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PageOptionsDto } from 'src/common/interfaces/pagination/page-options.dto';
import { PageDto } from 'src/common/interfaces/pagination/page.dto';

@Injectable()
export class TrackersService {
  constructor(private prismaService: PrismaService) {}
  async create(createTrackerDto: CreateTrackerDto) {
    const tracker = await this.prismaService.tracker.create({
      data: createTrackerDto,
    });
    return { data: tracker };
  }

  async findAll() {
    const trackers = await this.prismaService.tracker.findMany();
    return { data: trackers };
  }

  async findOne(id: number) {
    const tracker = await this.prismaService.tracker.findUnique({
      where: { id },
    });
    return { data: tracker };
  }

  async update(id: number, updateTrackerDto: UpdateTrackerDto) {
    const tracker = await this.prismaService.tracker.update({
      where: { id },
      data: updateTrackerDto,
    });
    return { data: tracker };
  }

  async remove(id: number) {
    const tracker = await this.prismaService.tracker.delete({
      where: { id },
    });
    return { data: tracker };
  }

  async getCurrentLocations() {
    const location = await this.getCurrentLocationsQuery();
    return { data: location };
  }

  private async getCurrentLocationsQuery() {
    const currentLocations = await this.prismaService.location.groupBy({
      by: ['trackerId'],
      _count: {
        id: true,
      },
      _max: {
        timestamp: true,
      },
    });

    const trackerIds = currentLocations.map((location) => location.trackerId);

    const locations = await this.prismaService.location.findMany({
      where: {
        trackerId: {
          in: trackerIds,
        },
        timestamp: {
          in: currentLocations.map((location) => location._max.timestamp),
        },
      },
    });

    return locations;
  }

  async getTrackerLocationsHistoryQuery(
    trackerId: number,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<any>> {
    const result = await this.prismaService.location.findMany({
      skip: (pageOptionsDto.page - 1) * pageOptionsDto.take,
      take: pageOptionsDto.take,
      where: {
        trackerId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    const count = await this.prismaService.location.count({
      where: {
        trackerId,
      },
    });

    return Promise.all([result, count]).then(([data, total]: [any, any]) => {
      const pageMetaDto = {
        page: pageOptionsDto.page,
        take: pageOptionsDto.take,
        itemCount: total,
        pageCount: Math.ceil(total / pageOptionsDto.take),
        hasPreviousPage: pageOptionsDto.page > 1,
        hasNextPage:
          pageOptionsDto.page < Math.ceil(total / pageOptionsDto.take),
      };
      return new PageDto(data, pageMetaDto);
    });
  }

  async getTrackerLocationsHistoryAll(trackerId: number) {
    const locations = await this.prismaService.location.findMany({
      where: {
        trackerId,
      },
    });
    return { data: locations };
  }
}
