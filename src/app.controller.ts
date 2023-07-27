import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './dto/login.dto';
import { ValidationPipe } from './common/validate.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getID() {
    return this.appService.create();
  }

  @Post('login')
  login(
    @Body(ValidationPipe) data: LoginDto,
    @Session() session: CustomSession,
  ) {
    if (session.user) return session.user;
    const isLogin = this.appService.login(data);
    if (isLogin) session.user = { role: Role.admin };
    return session.user;
  }

  @Post('/logout')
  async logout(@Session() session: CustomSession) {
    const role = session.user?.role || 'NotLogin';
    delete session.user;
    return { role };
  }
}
