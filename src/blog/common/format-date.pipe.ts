import { PipeTransform, Injectable } from '@nestjs/common';

/**
 * format 管道：对于 create、update 操作中前端传来的字符串字段进行转化
 */
@Injectable()
export class FormatDatePipe implements PipeTransform<any> {
  constructor(private transformKeys: string[] = []) {}

  async transform(value: any) {
    for (const key of this.transformKeys) {
      if (value[key] !== undefined) {
        value[key] = new Date(value[key]);
      }
    }

    return value;
  }
}
