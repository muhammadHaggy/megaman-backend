import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateAssetDto {
  @IsNotEmpty()
  @IsNumber()
  ownerId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  trackerId: number;
}
