import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as chalk from 'chalk';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now(); // Capture start time
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    this.logger.log(`Incoming ${method} request to ${url}`);

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const responseTime = Date.now() - now;

        this.logger.log(
          `Response: ${statusCode} | ${method} ${url} | Time: ${responseTime}ms`,
        );

        this.logger.debug(
          chalk.red('Method: ') +
            method +
            '\n' +
            chalk.red('URL: ') +
            url +
            '\n' +
            chalk.red('Status Code: ') +
            statusCode +
            '\n' +
            chalk.red('Response Time: ') +
            `${responseTime}ms` +
            '\n' +
            chalk.red('Response Body: ') +
            JSON.stringify(data, null, 2),
        );
      }),
    );
  }
}
