import { ResponseObject, ResponseArray, IResponseMetadata } from '../transformers/response.transformer';
import { plainToClass } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export abstract class BaseController {
  protected objectResponse<T, V>(
    data: V,
    subject: ClassConstructor<T>,
    message?: string,
    status = 200,
  ): ResponseObject<T> {
    const transformedData = plainToClass(subject, data, { excludeExtraneousValues: true });
    return new ResponseObject(transformedData, { message, status });
  }

  protected arrayResponse<T, V>(
    data: V[],
    subject: ClassConstructor<T>,
    message?: string,
    status = 200,
  ): ResponseArray<T> {
    const transformedData = plainToClass(subject, data, { excludeExtraneousValues: true });
    return new ResponseArray(transformedData, { message, status });
  }

  protected responseData<T, V>(
    data: V | V[],
    subject: ClassConstructor<T>,
    message?: string,
    status = 200,
  ): ResponseObject<T> | ResponseArray<T> {
    if (Array.isArray(data)) {
      return this.arrayResponse(data, subject, message, status);
    }
    return this.objectResponse(data, subject, message, status);
  }
}
