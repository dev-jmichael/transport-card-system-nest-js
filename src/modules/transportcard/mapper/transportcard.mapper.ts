import { Injectable } from '@nestjs/common';
import { TransportCard } from '../transportcard.entity';
import { TransportCardResponse } from '../dto/transport-card-response';

@Injectable()
export class TransportCardMapper {
  // Convert entity to DTO (TransportCard -> TransportCardResponse)
  toDTO(entity: TransportCard): TransportCardResponse {
    return {
      cardNumber: entity.cardNumber,
      loadAmount: entity.loadAmount,
      cardType: entity.cardType,
      yearsOfValidity: entity.yearsOfValidity,
    };
  }

  // Convert DTO to entity (TransportCardResponse -> TransportCard)
  toEntity(dto: TransportCardResponse): TransportCard {
    const entity = new TransportCard();
    entity.cardNumber = dto.cardNumber;
    entity.loadAmount = dto.loadAmount;
    entity.cardType = dto.cardType;
    entity.yearsOfValidity = dto.yearsOfValidity;
    return entity;
  }
}
