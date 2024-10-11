import { InvalidCardTypeException } from '../../../common/exceptions/invalid-card-type.exception';
import { TransportCardTypeEnum } from './transport-card-type.enum';

export class TransportCardType {
  private static readonly CARD_TYPE_MAP: Record<string, TransportCardType> = {};

  constructor(
    public readonly initialLoadAmount: number,
    public readonly yearsOfValidity: number,
    public readonly fareRate: number,
    private readonly discountRate: number = 0,
    public readonly cardType: TransportCardTypeEnum,
  ) {}

  // Fare calculation logic
  calculateFare(): number {
    return this.fareRate * (1 - this.discountRate);
  }

  // Static method to initialize the card types
  static initialize() {
    this.CARD_TYPE_MAP[TransportCardTypeEnum.REGULAR.toLowerCase()] =
      new TransportCardType(10, 5, 15.0, 0, TransportCardTypeEnum.REGULAR);
    this.CARD_TYPE_MAP[TransportCardTypeEnum.DISCOUNTED.toLowerCase()] =
      new TransportCardType(
        500.0,
        3,
        10.0,
        0.2,
        TransportCardTypeEnum.DISCOUNTED,
      );
  }

  // Static method to get the transport card type
  static getTransportCardType(cardType: string): TransportCardType {
    const type = this.CARD_TYPE_MAP[cardType.toLowerCase()];
    if (!type) {
      throw new InvalidCardTypeException(`Invalid card type: '${cardType}'.`);
    }
    return type;
  }
}

// Initialize the card types on startup
TransportCardType.initialize();
