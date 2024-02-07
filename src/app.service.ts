import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { config as configEnv } from 'dotenv';

const { parsed } = configEnv({ path: '.env.local' });
const userInfo: LoginDto = JSON.parse(parsed.USERINFO);

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
