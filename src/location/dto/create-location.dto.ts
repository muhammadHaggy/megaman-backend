import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

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

  @IsDate()
  @ApiProperty({
    required: false,
  })
  timestamp?: Date;
}
