import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { RolesGuard } from 'src/common/permission/roles.guard';
import { Roles } from 'src/common/permission/roles.decorator';
import { ValidationPipe } from 'src/common/validate.pipe';

@UseGuards(RolesGuard)
@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post()
  @Roles(Role.admin)
  create(@Body(ValidationPipe) createTypeDto: CreateTypeDto) {
    return this.typeService.create(createTypeDto);
  }

  @Patch(':id')
  @Roles(Role.admin)
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTypeDto: UpdateTypeDto,
  ) {
    return this.typeService.update(+id, updateTypeDto);
  }

  @Delete(':id')
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.typeService.remove(+id);
  }
}
