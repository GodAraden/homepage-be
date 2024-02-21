import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { tips } from './dictionary';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  login(loginDto: LoginDto) {
    const userInfoStr = this.configService.get<string>('USERINFO');
    const userInfo: LoginDto = JSON.parse(userInfoStr);

    if (loginDto.username === userInfo.username) {
      if (loginDto.password === userInfo.password) {
        return true;
      }
    }
    throw new BadRequestException(tips.httpExeceptions.loginFailed);
  }
}
