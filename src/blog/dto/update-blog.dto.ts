import { Blog } from '@prisma/client';
import { IsString, IsOptional, IsArray, IsDate } from 'class-validator';

export class UpdateBlogDto implements Partial<Blog> {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  author: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsArray()
  @IsOptional()
  createTags: string[];

  @IsArray()
  @IsOptional()
  deleteTags: string[];

  @IsDate()
  @IsOptional()
  postAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
