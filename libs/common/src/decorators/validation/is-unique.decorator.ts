import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersService } from '@gearspace/users';

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUniqueEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(email: string, args: ValidationArguments) {
          try {
            const userService = args.object['userService'] as UsersService;
            if (!userService) {
              throw new Error('UserService not found in validation context');
            }

            const existingUser = await userService.findByEmail(email);
            return !existingUser;
          } catch (error) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is already registered`;
        },
      },
    });
  };
}

export const InjectUserService = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.userService;
});
