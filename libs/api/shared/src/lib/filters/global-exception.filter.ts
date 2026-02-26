import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError } from '@helpdesk/shared/interfaces';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as
        | string
        | {
            message?: string | string[];
            error?: string;
            [key: string]: unknown;
          };

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = exceptionResponse.message ?? exception.message;
        if (typeof exceptionResponse.error === 'string') {
          errorCode = exceptionResponse.error;
        } else {
          errorCode = exception.name;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = 'INTERNAL_SERVER_ERROR';
    }

    this.logger.error(
      `${request.method} ${request.originalUrl} ${status} - Error: ${JSON.stringify(
        message,
      )}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse: ApiError = {
      success: false,
      statusCode: status,
      message,
      error: errorCode,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
