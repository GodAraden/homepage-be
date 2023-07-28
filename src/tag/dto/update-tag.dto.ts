import { Tag } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateTagDto implements Partial<Tag> {
  @IsString()
  tagName: string;
}
