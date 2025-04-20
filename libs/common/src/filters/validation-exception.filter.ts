import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

interface IErrorResponse {
  message: string;
  errors?: string;
  timestamp: string;
  statusCode: number;
  path?: string;
}

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string | undefined;

    // Handle HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        // Handle validation errors
        if ('errors' in exceptionResponse) {
          const validationErrors = exceptionResponse['errors'] as Array<{
            property: string;
            constraints: Record<string, string>;
          }>;

          errors = validationErrors.map((error) => Object.values(error.constraints).join(', ')).join(', ');
          message = 'Validation failed';
        } else if ('message' in exceptionResponse) {
          message = exceptionResponse['message'] as string;
        }
      }
    }
    // Handle class-validator ValidationError
    else if (Array.isArray(exception) && exception[0] instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      errors = exception
        .map((error) => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }
          return '';
        })
        .filter(Boolean)
        .join(', ');
    }
    // Handle other errors
    else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: IErrorResponse = {
      message,
      timestamp: new Date().toISOString(),
      statusCode: status,
      path: request.url,
    };

    if (errors) {
      errorResponse.errors = errors;
    }

    response.status(status).json(errorResponse);
  }
}
