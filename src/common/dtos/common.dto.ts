import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ default: 'Create something successfully' })
  message: string;
}

export class BasePayload {
  [key: string]: unknown;
}
