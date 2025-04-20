import { ClassTransformOptions } from 'class-transformer';

export class BaseController {
  protected transformToObject<T>(data: T, options?: ClassTransformOptions): T {
    return data;
  }

  protected transformToArray<T>(data: T[], options?: ClassTransformOptions): T[] {
    return data;
  }
}
