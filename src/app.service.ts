import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { tips } from './dictionary';
import { userInfo } from './env';

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
