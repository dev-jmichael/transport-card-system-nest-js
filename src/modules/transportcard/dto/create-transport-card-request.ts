import { IsNotEmpty } from 'class-validator';

export class CreateTransportCardRequest {
  @IsNotEmpty({ message: 'Card type cannot be empty.' })
  cardType: string;
}
