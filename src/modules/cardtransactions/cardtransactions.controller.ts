import {
  Controller,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CardTransactionService } from './cardtransactions.service';
import { TransportCard } from '../transportcard/transportcard.entity';

@ApiTags('Card Transactions')
@Controller('/api/v1/transport-cards')
export class CardTransactionController {
  private readonly logger = new Logger(CardTransactionController.name);

  constructor(private readonly service: CardTransactionService) {}

  @Patch(':cardNumber')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Process fare payment',
    description: "Processes fare payment via commuter's card number.",
  })
  @ApiResponse({
    status: 200,
    description: 'Fare payment is successful',
  })
  @ApiResponse({
    status: 402,
    description: 'Insufficient balance exception.',
  })
  async processFarePayment(
    @Param('cardNumber', ParseIntPipe) cardNumber: number,
  ): Promise<TransportCard> {
    this.logger.log(
      `Received request to process fare payment for card number: ${cardNumber}`,
    );

    const response = await this.service.processFarePayment(cardNumber);

    this.logger.log(
      `Successfully processed fare payment for card number: ${cardNumber}`,
    );

    return response;
  }
}
