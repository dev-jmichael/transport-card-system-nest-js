import { BadRequestException } from '@nestjs/common';

export class InvalidCardTypeException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
