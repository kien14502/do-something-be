import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: '2025-12-19T10:44:21.676Z' })
  timestamp: string;
}
