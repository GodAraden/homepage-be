import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { config as configEnv } from 'dotenv';

// 格式 USERINFO=username:xxx~password:yyy，用井号分割后面的会被当成注释/(ㄒoㄒ)/~~
const { parsed } = configEnv({
  path: '.env.local',
});
const userInfo: LoginDto | Record<string, never> = Object.fromEntries(
  parsed.USERINFO?.split('~').map((pairs) => pairs.split(':')) || [],
);

@Injectable()
export class AppService {
  @Inject('PrismaClient') private prisma: PrismaClient;

  async test() {
    const users = await this.prisma.test.findMany();
    if (users.length >= 50) {
      return { message: '容量已满', data: users };
    } else {
      const user = await this.prisma.test.create({ data: {} });
      return user;
    }
  }

  login(loginDto: LoginDto) {
    if (loginDto.username === userInfo.username) {
      if (loginDto.password === userInfo.password) {
        return true;
      }
    }
    throw new HttpException('LoginFailed', HttpStatus.BAD_REQUEST);
  }
}
