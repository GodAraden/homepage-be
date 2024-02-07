import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { tips } from './dictionary';

@Injectable()
export class ValidationPipe<T> implements PipeTransform<T> {
  async transform(value: T, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value;

    const errors = await validate(plainToInstance(metatype, value));
    if (errors.length > 0) {
      throw new BadRequestException(tips.httpExeceptions.validation);
    }
    return value;
  }

  private toValidate(metatype: unknown) {
    const types = [String, Boolean, Number, Array, Object];
    return !types.some((type) => type === metatype);
  }
}
