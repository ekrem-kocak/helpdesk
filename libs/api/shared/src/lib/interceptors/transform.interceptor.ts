import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: any;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.data && data.meta) {
          return {
            success: true,
            timestamp: new Date().toISOString(),
            data: data.data,
            meta: data.meta,
          };
        }

        return {
          success: true,
          timestamp: new Date().toISOString(),
          data: data,
        };
      }),
    );
  }
}
