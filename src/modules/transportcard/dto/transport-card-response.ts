import {
  TransportCardType,
  TransportCardTypeEnum,
} from 'src/common/constants/transportcard.type';

export class TransportCardResponse {
  cardNumber: number;
  loadAmount: number;
  yearsOfValidity: number;
  cardType: TransportCardTypeEnum;
}
