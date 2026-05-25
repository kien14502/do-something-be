import {
  WORKSPACE_ROLE,
  WORKSPACE_STATUS_INVITE,
} from '@/shared/enums/workspace';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class GetMemberWorkspaceDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  @IsEnum(WORKSPACE_STATUS_INVITE)
  statusInvite?: WORKSPACE_STATUS_INVITE;

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  @IsEnum(WORKSPACE_ROLE)
  role?: WORKSPACE_ROLE;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
