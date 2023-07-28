import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { RolesGuard } from 'src/common/permission/roles.guard';
import { Roles } from 'src/common/permission/roles.decorator';
import { ValidationPipe } from 'src/common/validate.pipe';
import { FormatDatePipe } from './common/formatDate.pipe';
import { FetchBlogDto } from './dto/fetch-blog.dto';

@UseGuards(RolesGuard)
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @Roles(Role.admin)
  @UsePipes(new FormatDatePipe(['postAt', 'updateAt']))
  create(@Body(ValidationPipe) createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Post('list')
  @UsePipes(new FormatDatePipe(['startDate', 'endDate']))
  findAll(@Body(ValidationPipe) fetchBlogDto: FetchBlogDto) {
    return this.blogService.findList(fetchBlogDto);
  }

  @Post('like')
  likeBlog(@Body('id') id: string) {
    return this.blogService.like(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.admin)
  @UsePipes(new FormatDatePipe(['postAt', 'updateAt']))
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
