import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type {
  ApiPaginatedResponse,
  ApiResponse,
} from '@helpdesk/shared/interfaces';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | ApiPaginatedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | ApiPaginatedResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // PageDto yapısı: { data: T[], meta: PageMeta }
        if (data && data.data && data.meta) {
          return {
            success: true,
            timestamp: new Date().toISOString(),
            data: data.data,
            meta: data.meta,
          } as ApiPaginatedResponse<T>;
        }

        return {
          success: true,
          timestamp: new Date().toISOString(),
          data: data,
        } as ApiResponse<T>;
      }),
    );
  }
}
