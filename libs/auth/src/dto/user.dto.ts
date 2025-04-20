import { Expose, Transform } from 'class-transformer';
import { ToBoolean, ToDate } from '@gearspace/common/transformers/response.transformer';

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

  @Expose()
  @ToDate()
  updatedAt: Date;

  @Expose()
  @Transform(({ value }) => value?.id || null)
  roleId: string | null;
} 