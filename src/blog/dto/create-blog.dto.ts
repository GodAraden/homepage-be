import { Blog } from '@prisma/client';
import { IsArray, IsString, IsDate, IsOptional } from 'class-validator';

export class CreateBlogDto implements Partial<Blog> {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  author: string;

  @IsString()
  content: string;

  @IsString()
  type: string;

  @IsArray()
  tags: string[];

  @IsDate()
  @IsOptional()
  postAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
