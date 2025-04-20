import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UsersService } from '@gearspace/users';

@Injectable()
export class ValidationWithContextPipe implements PipeTransform<any> {
  constructor(private readonly userService: UsersService) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    object['userService'] = this.userService;

    const errors = await validate(object);
    if (errors.length > 0) {
      const messages = errors.map((err) => {
        return {
          property: err.property,
          constraints: err.constraints,
        };
      });
      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }

    return value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
