import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export interface ICurrentUser {
  id: string;
  email: string;
  sub: string;
}
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as ICurrentUser;
});
