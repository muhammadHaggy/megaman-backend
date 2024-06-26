import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateTrackerDto {
  @IsNotEmpty()
  @IsInt()
  ownerId: number;

  @IsNotEmpty()
  @IsInt()
  assetId: number;
}
