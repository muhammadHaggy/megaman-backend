import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from './page-options.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PageOptionsWithSearchQuery extends PageOptionsDto {
  @ApiProperty({
    required: false,
    type: String,
    default: '',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
