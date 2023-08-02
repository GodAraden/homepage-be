import {
  IsArray,
  IsString,
  IsDate,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class FetchBlogDto {
  @IsNumber()
  current: number;

  @IsNumber()
  pageSize: number;

  @IsString()
  @IsOptional()
  typeName: string;

  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  @IsOptional()
  keyword: string;

  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;

  @IsString()
  @IsOptional()
  orderBy: 'readNum' | 'likeNum' | 'postAt';

  @IsString()
  @IsOptional()
  order: 'asc' | 'desc';
}
