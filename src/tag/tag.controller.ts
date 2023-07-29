import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { RolesGuard } from 'src/common/permission/roles.guard';
import { Roles } from 'src/common/permission/roles.decorator';
import { ValidationPipe } from 'src/common/validate.pipe';

@UseGuards(RolesGuard)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Post()
  @Roles(Role.admin)
  create(@Body(ValidationPipe) createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Patch(':id')
  @Roles(Role.admin)
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
