import { Type } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateTypeDto implements Partial<Type> {
  @IsString()
  typeName: string;
}
