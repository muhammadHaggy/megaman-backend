import { Injectable } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackersService {
  constructor(private prismaService: PrismaService) {}
  create(createTrackerDto: CreateTrackerDto) {
    return this.prismaService.tracker.create({
      data: createTrackerDto,
    });
  }

  findAll() {
    return this.prismaService.tracker.findMany();
  }

  findOne(id: number) {
    return this.prismaService.tracker.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTrackerDto: UpdateTrackerDto) {
    return this.prismaService.tracker.update({
      where: { id },
      data: updateTrackerDto,
    });
  }

  remove(id: number) {
    return this.prismaService.tracker.delete({
      where: { id },
    });
  }

  getCurrentLocations() {
    return this.getCurrentLocationsQuery();
  }

  private async getCurrentLocationsQuery() {
    const currentLocations = await this.prismaService.$queryRaw`
      SELECT l1.*
      FROM "Location" l1
      INNER JOIN (
        SELECT "trackerId", MAX("timestamp") as latest_timestamp
        FROM "Location"
        GROUP BY "trackerId"
      ) l2
      ON l1."trackerId" = l2."trackerId" AND l1."timestamp" = l2.latest_timestamp
    `;

    return currentLocations;
  }
}
