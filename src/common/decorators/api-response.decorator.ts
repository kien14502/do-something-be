// common/decorators/api-response.decorator.ts
import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dtos/api-response.dto';

export const ApiOkResponseCustom = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  message: string = 'Success',
) =>
  applyDecorators(
    ApiExtraModels(ApiResponseDto, dataDto),
    ApiOkResponse({
      description: message,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              statusCode: {
                type: 'number',
                example: 200,
              },
              message: {
                type: 'string',
                example: message,
              },
              data: {
                $ref: getSchemaPath(dataDto),
              },
              timestamp: {
                type: 'string',
                example: '2025-12-19T10:44:21.676Z',
              },
            },
          },
        ],
      },
    }),
  );
