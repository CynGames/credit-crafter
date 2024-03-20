import { ApiBadRequestResponse, ApiResponseOptions } from '@nestjs/swagger';

type ApiDecorator = typeof ApiBadRequestResponse;

export function bindApiDecorator(
  decorator: ApiDecorator,
  options: ApiResponseOptions,
) {
  return decorator.bind(null, options);
}
