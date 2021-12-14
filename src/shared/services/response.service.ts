import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { get, isNil, isEmpty } from 'lodash';
import { Response } from 'express';

export class ResponseObject<T> {
  @ApiProperty({
    description: 'Error Code',
  })
  code?: string;

  @ApiProperty({
    description: 'Response Message',
  })
  message?: string;

  @ApiProperty({
    description: 'Response Data',
  })
  data?: T;

  @ApiProperty({
    description: 'Validation Errors',
  })
  errors?: any;
}
const defaultStatus = 400;

@Injectable()
export class ResponseService {
  json<T>(
    res: Response,
    statusOrError: number | Error,
    message?: string,
    data?: Record<string, unknown> | Array<Record<string, unknown>> | T,
    code?: string,
  ): Response {
    const error = statusOrError instanceof Error ? statusOrError : null;

    const responseObj: ResponseObject<typeof data> = {};
    responseObj.message = message;

    let status = statusOrError;

    if (
      error &&
      Object.prototype.hasOwnProperty.call(error, '_message') &&
      get(error, '_message', '').includes('validation')
    ) {
      responseObj.message = 'Validation Error';
      responseObj.errors = get(error, 'errors', {});
      responseObj.errors = Object.keys(get(error, 'errors', {})).reduce(
        (acc: Record<string, unknown>, key: string) => ({
          ...acc,
          [key]: get(error, 'errors', {})[key].message,
        }),
        {},
      );
      status = 422;
    } else if (error) {
      const errorObj = statusOrError as Error;
      responseObj.message = errorObj.message;
      status = get(errorObj, 'status', defaultStatus);
    }

    if (!isNil(data)) {
      responseObj.data = data;
    }

    if (!isEmpty(code)) {
      responseObj.code = code;
    }

    const statusCode = status as number;
    return res.status(statusCode).json(responseObj);
  }
}
