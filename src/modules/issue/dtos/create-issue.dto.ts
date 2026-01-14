import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateIssueDto {
  @ApiProperty()
  @IsInt()
  projectId: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  issueTypeId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  statusId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  priorityId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  reporterId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  assigneeId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  parentIssueId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  storyPoints?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  estimateHours?: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
