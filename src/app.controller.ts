import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { ValidationPipe } from './common/validate.pipe';
import { LoginDto } from './dto/login.dto';
import { AppService } from './app.service';
import { getAppInfo } from './dictionary';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAppInfo() {
    return getAppInfo();
  }

  @Post('login')
  login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Session() session: CustomSession,
  ) {
    // 页面加载时会发送一个空的登录请求，通过 cookie 登陆方式
    if (loginDto.username === void 0 && loginDto.password === void 0) {
      if (session.user) return session.user;
      else return 'SessionCheckFailed';
    }
    // 如果有参数，通过参数中的账号密码登录
    const isLogin = this.appService.login(loginDto);
    if (isLogin) session.user = { role: Role.admin };
    return session.user;
  }

  @Post('logout')
  async logout(@Session() session: CustomSession) {
    const role = session.user?.role || 'NotLogin';
    delete session.user;
    return { role };
  }
}
