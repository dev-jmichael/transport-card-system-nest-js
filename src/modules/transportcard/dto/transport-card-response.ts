import { TransportCardTypeEnum } from '../value-objects/transport-card-type.enum';

export class TransportCardResponse {
  cardNumber: number;
  loadAmount: number;
  yearsOfValidity: number;
  cardType: TransportCardTypeEnum;
}
