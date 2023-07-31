import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  login(loginDto: LoginDto) {
    if (loginDto.username === userInfo.username) {
      if (loginDto.password === userInfo.password) {
        return true;
      }
    }
    throw new HttpException('LoginFailed', HttpStatus.BAD_REQUEST);
  }
}
