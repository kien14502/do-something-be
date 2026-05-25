import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class InviteMembersDto {
  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  ids: string[];
}
