import { BadRequestException, Injectable } from '@nestjs/common';
import { config as configEnv } from 'dotenv';
import { LoginDto } from './dto/login.dto';
import { tips } from './common/dictionary';

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
    throw new BadRequestException(tips.httpExeceptions.loginFailed);
  }
}
