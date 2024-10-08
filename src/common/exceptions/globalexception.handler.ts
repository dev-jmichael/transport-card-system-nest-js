import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CardNotFoundException } from './card-not-found.exception';
import { InvalidCardTypeException } from './invalid-card-type.exception';
import { InsufficientBalanceException } from './insufficient-balance.exception';

@Catch() // Catch all exceptions
export class GlobalExceptionHandler implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionHandler.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message = (exception as any).message || 'Internal server error';

    const body = {
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      status: status,
    };

    // If the exception is a known HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string; // Can be object or string, casting to string for simplicity

      // Now, check for specific custom exceptions based on their type
      if (exception instanceof CardNotFoundException) {
        status = HttpStatus.NOT_FOUND;
        this.logger.warn(`Card not found: ${exception.message}`);
        body.message = exception.message;
        body.status = status;
      }

      if (exception instanceof InvalidCardTypeException) {
        status = HttpStatus.BAD_REQUEST;
        this.logger.warn(`Invalid card type: ${exception.message}`);
        body.message = exception.message;
        body.status = status;
      }

      if (exception instanceof InsufficientBalanceException) {
        status = HttpStatus.PAYMENT_REQUIRED;
        this.logger.warn(`Insufficient balance: ${exception.message}`);
        body.message = exception.message;
        body.status = status;
      }
    } else {
      // Handle non-HttpExceptions, such as unexpected errors
      this.logger.error(
        `Unexpected error: ${message}`,
        (exception as any).stack,
      );
    }

    response.status(status).json(body);
  }
}
