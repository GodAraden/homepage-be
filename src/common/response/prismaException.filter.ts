import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

type PrismaError =
  | Prisma.PrismaClientValidationError
  | Prisma.PrismaClientRustPanicError
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientInitializationError;

@Catch(
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientInitializationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let message = exception.message;
    const status = 444;

    if (exception instanceof Prisma.PrismaClientValidationError) {
      // 参数验证失败
      message = 'ValidationError';
    } else if (exception instanceof Prisma.PrismaClientRustPanicError) {
      // 底层引擎崩溃并以非零退出代码退出
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      // 启动查询引擎并创建与数据库的连接时出现问题
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      // 查询引擎返回没有错误代码的错误
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // 查询引擎返回与请求相关的已知错误
      if (exception.code === 'P2002') {
        message = 'DuplicateUniqueKey';
      } else if (exception.code === 'P2003') {
        message = 'ForeignKeyExist';
      } else if (exception.code === 'P2025') {
        message = 'RecordNotExist';
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      data: null,
    });
  }
}
