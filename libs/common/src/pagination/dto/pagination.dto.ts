import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  page = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  limit = 10;
}
