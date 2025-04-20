import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseObject, ResponseArray, IResponseMetadata } from '../transformers/response.transformer';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // If data is already a ResponseObject or ResponseArray, return it as is
        if (data instanceof ResponseObject || data instanceof ResponseArray) {
          // Set the response status code to match the ResponseObject/ResponseArray status
          return data;
        }

        const metadata: IResponseMetadata = {
          status: response.statusCode,
        };

        // Handle array responses
        if (Array.isArray(data)) {
          return new ResponseArray(data, metadata);
        }

        // Handle object responses
        return new ResponseObject(data, metadata);
      }),
    );
  }
}
