import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Min(6)
  @Max(30)
  password: string;
}
