import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';
import { bindApiDecorator } from './util/bind-api-decorator.util';
import { BadRequestDto } from '../shared-definitions/dto/bad-request.dto';
import { InternalServerErrorDto } from '../shared-definitions/dto/internal-server-error.dto';
import { NotFoundDto } from '../shared-definitions/dto/not-found.dto';

const AppApiBadRequestResponse = bindApiDecorator(ApiBadRequestResponse, {
  type: BadRequestDto,
});

const AppApiInternalServerErrorResponse = bindApiDecorator(
  ApiInternalServerErrorResponse,
  { type: InternalServerErrorDto },
);

const AppApiNotFoundResponse = bindApiDecorator(ApiNotFoundResponse, {
  type: NotFoundDto,
});

export function AppApiOkResponse(options: ApiResponseOptions) {
  return applyDecorators(
    AppApiBadRequestResponse(),
    AppApiInternalServerErrorResponse(),
    AppApiNotFoundResponse(),
    ApiOkResponse(options),
  );
}

export function AppApiCreatedResponse(options: ApiResponseOptions) {
  return applyDecorators(
    AppApiBadRequestResponse(),
    AppApiInternalServerErrorResponse(),
    AppApiNotFoundResponse(),
    ApiCreatedResponse(options),
  );
}

export function AppApiNoContentResponse() {
  return applyDecorators(
    AppApiBadRequestResponse(),
    AppApiInternalServerErrorResponse(),
    AppApiNotFoundResponse(),
    ApiNoContentResponse(),
  );
}
