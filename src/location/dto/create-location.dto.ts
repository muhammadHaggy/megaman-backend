import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  trackerId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  longitude: number;
}
