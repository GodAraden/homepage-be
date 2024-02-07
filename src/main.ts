import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaClient } from '@prisma/client';
import * as session from 'express-session';
import { access, mkdir } from 'fs/promises';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { HttpExceptionFilter } from './common/response/httpException.filter';
import { PrismaExceptionFilter } from './common/response/prismaException.filter';
import { LoggerMiddleware } from './common/logger.middleware';

const prisma = new PrismaClient();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.registerGlobalService({ prisma }),
  );

  app.use(
    session({
      secret: "Araden's Website",
      name: 'session',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: { maxAge: null },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.use(LoggerMiddleware);

  app.enableCors({
    origin: ['https://www.araden.top'],
    credentials: true,
  });

  try {
    await access('images');
  } catch (error) {
    await mkdir('images');
  }

  app.useStaticAssets('images', { prefix: '/image' });

  await app.listen(3000);
}

bootstrap();
