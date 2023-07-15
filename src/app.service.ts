import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  @Inject('PrismaClient') private prisma: PrismaClient;

  async create() {
    const users = await this.prisma.test.findMany();
    if (users.length >= 50) {
      return { message: '容量已满', data: users };
    } else {
      const user = await this.prisma.test.create({ data: {} });
      return user;
    }
  }
}
