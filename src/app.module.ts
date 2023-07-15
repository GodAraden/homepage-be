import { DynamicModule, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static registerGlobalService(config: {
    prisma: PrismaClient;
  }): DynamicModule {
    return {
      global: true,
      module: AppModule,
      providers: [{ provide: 'PrismaClient', useValue: config.prisma }],
      exports: ['PrismaClient'],
    };
  }
}
