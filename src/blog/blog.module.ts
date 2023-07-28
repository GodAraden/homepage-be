import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
// 导入 Type、Tag 两个模块，以便能使用这两个模块导出的 provider
import { TypeModule } from 'src/type/type.module';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [TypeModule, TagModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
