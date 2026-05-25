import { ApiProperty } from '@nestjs/swagger';

export class PageResponseDto<T> {
  @ApiProperty({ type: Array })
  items: T[];
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  hasNextPage: boolean;
  @ApiProperty()
  hasPreviousPage: boolean;
  @ApiProperty()
  total: number;
}
