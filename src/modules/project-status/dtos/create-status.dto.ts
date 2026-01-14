import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  color: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  position: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  projectId: string;
}
