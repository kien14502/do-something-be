import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class GetAllDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  isRead?: boolean;
}
