import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SPRINT_STATUS } from 'src/shared/enums/sprint';

export class CreateSprintDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  goal: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ enumName: 'sprint_status', enum: SPRINT_STATUS })
  @IsOptional()
  @IsEnum(SPRINT_STATUS)
  status: SPRINT_STATUS;
}
