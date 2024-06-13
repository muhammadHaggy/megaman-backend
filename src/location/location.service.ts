import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(readonly prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto) {
    const location = await this.prisma.location.create({
      data: createLocationDto,
    });
    return { data: location };
  }

  // Bulk Create [FUTURE WORK]
  // createBulk(createLocationDto: CreateLocationDto[]) {
  //   return this.prisma.location.createMany({
  //     data: createLocationDto,
  //   });
  // }
}
