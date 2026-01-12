import {
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateIssueDto {
  @IsInt()
  projectId: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  issueTypeId?: number;

  @IsOptional()
  @IsInt()
  statusId?: number;

  @IsOptional()
  @IsInt()
  priorityId?: number;

  @IsOptional()
  @IsInt()
  reporterId?: number;

  @IsOptional()
  @IsInt()
  assigneeId?: number;

  @IsOptional()
  @IsInt()
  parentIssueId?: number;

  @IsOptional()
  @IsInt()
  storyPoints?: number;

  @IsOptional()
  @IsNumber()
  estimateHours?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
