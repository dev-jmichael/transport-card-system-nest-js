import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransportCardMapper } from './mapper/transportcard.mapper';
import { CreateTransportCardRequest } from './dto/create-transport-card-request';
import { TransportCardResponse } from './dto/transport-card-response';
import { TransportCardType } from './value-objects/transport-card-type';
import { TransportCard } from './transportcard.entity';
import { Repository } from 'typeorm';
import { CardNotFoundException } from '../../common/exceptions/card-not-found.exception';

@Injectable()
export class TransportCardService {
  private readonly logger = new Logger(TransportCardService.name);

  constructor(
    @InjectRepository(TransportCard)
    private readonly repository: Repository<TransportCard>,
    private readonly mapper: TransportCardMapper,
  ) {}

  async createTransportCard(
    request: CreateTransportCardRequest,
  ): Promise<TransportCardResponse> {
    this.logger.log(
      `Creating transport card for card type: ${request.cardType}`,
    );

    const transportCardType = TransportCardType.getTransportCardType(
      request.cardType,
    );

    const transportCard = await this.repository.save({
      loadAmount: transportCardType.initialLoadAmount,
      yearsOfValidity: transportCardType.yearsOfValidity,
      cardType: transportCardType.cardType,
    });

    this.logger.log(
      `Successfully created transport card with card number: ${transportCard.cardNumber}`,
    );

    return this.mapper.toDTO(transportCard);
  }

  async getAllTransportCards(): Promise<TransportCardResponse[]> {
    this.logger.log('Fetching all transport cards...');
    const transportCards = await this.repository.find();
    const transportCardDTOs = transportCards.map((card) =>
      this.mapper.toDTO(card),
    );

    this.logger.log(
      `Successfully retrieved ${transportCardDTOs.length} transport cards`,
    );
    return transportCardDTOs;
  }

  async getTransportCardById(
    cardNumber: number,
  ): Promise<TransportCardResponse> {
    this.logger.log(`Fetching transport card with card number: ${cardNumber}`);

    const transportCard = await this.repository.findOne({
      where: { cardNumber },
    });
    if (!transportCard) {
      this.logger.warn(
        `Transport card with card number ${cardNumber} not found`,
      );
      throw new CardNotFoundException(
        `Transport card with card number ${cardNumber} not found`,
      );
    }

    this.logger.log(
      `Successfully found transport card with card number: ${cardNumber}`,
    );
    return this.mapper.toDTO(transportCard);
  }
}
