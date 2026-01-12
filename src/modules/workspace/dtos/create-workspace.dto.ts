import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  WORKSPACE_HOW_DID_YOU_HEAR_ABOUT_US,
  WORKSPACE_MANAGER,
  WORKSPACE_MODE,
} from 'src/shared/enums/workspace';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'workspace name' })
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty({ example: 'workspace name' })
  @IsOptional()
  @IsString()
  avatar?: string;
  @ApiProperty({ example: 'workspace name' })
  @IsNotEmpty()
  @IsString()
  mode: WORKSPACE_MODE;
  @ApiProperty({ example: 'workspace name' })
  @IsOptional()
  manager?: WORKSPACE_MANAGER;
  @ApiProperty({ example: 'workspace name' })
  @IsOptional()
  hearType?: WORKSPACE_HOW_DID_YOU_HEAR_ABOUT_US;
  @ApiProperty({ example: 'workspace name' })
  @IsOptional()
  members?: string[];
}
