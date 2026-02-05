import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDto } from '../dto/page.dto';

export const ApiPaginatedResponse = <T extends Type<unknown>>(
  dataDto: T,
  description?: string,
) => {
  return applyDecorators(
    ApiExtraModels(PageDto, dataDto),
    ApiOkResponse({
      description: description || 'Paginated response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
};
