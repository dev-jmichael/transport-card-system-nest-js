import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RestApiResponse } from '../dto/rest-api-response';

@Injectable()
export class ApiResponseFormatInterceptor implements NestInterceptor {
  intercept<T>(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<RestApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        return new RestApiResponse<T>(true, data);
      }),
    );
  }
}
