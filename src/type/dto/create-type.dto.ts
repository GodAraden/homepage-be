import { Type } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateTypeDto implements Partial<Type> {
  @IsString()
  typeName: string;
}
