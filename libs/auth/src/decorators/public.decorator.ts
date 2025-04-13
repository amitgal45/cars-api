import { SetMetadata } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export function PublicRoute() {
  return applyDecorators(
    Public,
    ApiBearerAuth('none') // This removes the bearer auth requirement in Swagger
  );
}
