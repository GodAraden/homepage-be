import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface ResponseData<T> {
  data: T;
  message: string;
  status: number;
}

@Injectable()
export class ResponseInterceptor<T = unknown> implements NestInterceptor {
  intercept(_: unknown, next: CallHandler): Observable<ResponseData<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          message: 'success',
          status: 0,
        };
      }),
    );
  }
}
