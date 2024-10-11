import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportCard } from '../transportcard/transportcard.entity'; // Assuming entity is named TransportCard
import { TransportCardType } from '../../common/constants/transportcard.type';
import { CardNotFoundException } from '../../common/exceptions/card-not-found.exception';
import { InsufficientBalanceException } from '../../common/exceptions/insufficient-balance.exception';

@Injectable()
export class CardTransactionService {
  private readonly logger = new Logger(CardTransactionService.name);

  constructor(
    @InjectRepository(TransportCard) // Inject the repository for TransportCard entity
    private readonly repository: Repository<TransportCard>,
  ) {}

  async processFareDeduction(cardNumber: number): Promise<TransportCard> {
    this.logger.log(`Processing fare deduction for card number: ${cardNumber}`);

    // Fetch the transport card by ID
    const transportCard = await this.repository.findOne({
      where: { cardNumber },
    });
    if (!transportCard) {
      this.logger.warn(`Card not found for card number: ${cardNumber}`);
      throw new CardNotFoundException(
        `Card not found for card number: ${cardNumber}`,
      );
    }

    this.logger.log(`Transport card found for card number: ${cardNumber}`);

    // Get the card type and calculate fare
    const cardType = TransportCardType.getTransportCardType(
      transportCard.cardType,
    );
    const fare = cardType.calculateFare();
    this.logger.log(
      `Fare calculated for card type ${cardType.cardType}: ${fare}`,
    );

    // Check if there is sufficient balance
    if (transportCard.loadAmount < fare) {
      this.logger.warn(
        `Insufficient balance on card number ${cardNumber}. Available balance: ${transportCard.loadAmount}, Required fare: ${fare}`,
      );
      throw new InsufficientBalanceException(
        `Insufficient balance on the card.`,
      );
    }

    // Deduct the fare and update the card balance
    transportCard.loadAmount -= fare;
    const updatedTransportCard = await this.repository.save(transportCard);
    this.logger.log(
      `Fare deducted successfully. Updated balance for card number ${cardNumber}: ${updatedTransportCard.loadAmount}`,
    );

    return updatedTransportCard;
  }
}
