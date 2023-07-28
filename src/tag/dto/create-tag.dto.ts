import { Tag } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateTagDto implements Partial<Tag> {
  @IsString()
  tagName: string;
}
