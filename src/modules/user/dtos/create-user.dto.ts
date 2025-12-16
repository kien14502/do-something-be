import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'john',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User password',
    example: 'john1234',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User avatar',
    example: 'john@example.com',
  })
  @IsOptional()
  avatar: string;
}
