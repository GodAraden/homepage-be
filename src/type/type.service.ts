import { PrismaClient } from '@prisma/client';
import { Inject, Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypeService {
  @Inject('PrismaClient') private prisma: PrismaClient;

  findAll() {
    return this.prisma.type.findMany({
      select: {
        _count: true,
        typeName: true,
        id: true,
      },
    });
  }

  create(createTypeDto: CreateTypeDto) {
    return this.prisma.type.create({
      data: createTypeDto,
    });
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return this.prisma.type.update({
      where: { id },
      data: updateTypeDto,
    });
  }

  remove(id: number) {
    return this.prisma.type.delete({
      where: { id },
    });
  }
}
