import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiGlobalResponses() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponseDto' },
          example: {
            code: 401,
            message: 'Unauthorized',
            path: '/api/resource',
            timestamp: new Date().toISOString(),
          },
        },
      },
    }),

    ApiResponse({
      status: 403,
      description: 'Forbidden resource',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponseDto' },
          example: {
            code: 403,
            message: 'Forbidden',
            path: '/api/resource',
            timestamp: new Date().toISOString(),
          },
        },
      },
    }),

    ApiResponse({
      status: 500,
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponseDto' },
          example: {
            code: 500,
            message: 'Internal server error',
            path: '/api/resource',
            timestamp: new Date().toISOString(),
          },
        },
      },
    }),
  );
}
