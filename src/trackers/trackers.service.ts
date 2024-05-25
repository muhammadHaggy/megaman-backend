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
}
