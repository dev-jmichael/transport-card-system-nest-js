import {
  Controller,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
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
    summary: 'Process fare deduction',
    description: "Processes fare deduction via commuter's card number.",
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 402,
    description: 'Insufficient balance exception.',
  })
  async processFareDeduction(
    @Param('cardNumber') cardNumber: number,
  ): Promise<TransportCard> {
    this.logger.log(
      `Received request to process fare deduction for card number: ${cardNumber}`,
    );

    const response = await this.service.processFareDeduction(cardNumber);

    this.logger.log(
      `Successfully processed fare deduction for card number: ${cardNumber}`,
    );

    return response;
  }
}
