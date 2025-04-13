import { IsEnum, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { ISearchPagination, ISortPagination } from '../types/pagination.types';
import { ApiProperty } from '@nestjs/swagger';

export class SearchPaginationDto<T> extends PaginationDto implements ISearchPagination<T> {
  @ApiProperty({ required: false })
  @IsString()
  search?: string;
}

export class SortPaginationDto<T> extends PaginationDto implements ISortPagination<T> {
  @ApiProperty({ required: false })
  @IsString()
  sort: keyof T = 'name' as keyof T;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'ASC';
}

export class SearchSortPaginationDto<T> extends SearchPaginationDto<T> implements ISortPagination<T> {
  @ApiProperty({ required: false })
  @IsString()
  sort: keyof T = 'name' as keyof T;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'ASC';
}
