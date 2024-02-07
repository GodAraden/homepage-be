import { Request, Response } from 'express';

export async function LoggerMiddleware(
  req: Request,
  res: Response,
  next: () => void,
) {
  const info = `${new Date().toLocaleString('zh-CN')} ${req.method} ${
    req.originalUrl
  } ${res.statusCode}`;

  console.log(info);

  next();
}
