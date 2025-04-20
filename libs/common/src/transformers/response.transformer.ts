import { Transform, TransformFnParams } from 'class-transformer';
import { Expose } from 'class-transformer';

export interface IResponseMetadata {
  message?: string;
  status: number;
}

export class ResponseObject<T> {
  @Expose()
  data: T;

  @Expose()
  message?: string;

  @Expose()
  status: number;

  constructor(data: T, metadata: IResponseMetadata) {
    this.data = data;
    this.message = metadata.message;
    this.status = metadata.status;
  }
}

export class ResponseArray<T> {
  @Expose()
  data: T[];

  @Expose()
  message?: string;

  @Expose()
  status: number;

  constructor(data: T[], metadata: IResponseMetadata) {
    this.data = data;
    this.message = metadata.message;
    this.status = metadata.status;
  }
}

// Transform decorators for common transformations
export const ToBoolean = () => Transform(({ value }: TransformFnParams) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
});

export const ToNumber = () => Transform(({ value }: TransformFnParams) => {
  if (typeof value === 'string') {
    return Number(value);
  }
  return value;
});

export const ToDate = () => Transform(({ value }: TransformFnParams) => {
  if (typeof value === 'string') {
    return new Date(value);
  }
  return value;
});

// Example usage in a DTO:
/*
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  @ToBoolean()
  isActive: boolean;

  @Expose()
  @ToDate()
  createdAt: Date;
}
*/ 