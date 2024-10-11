import { TransportCardTypeEnum } from './value-objects/transport-card-type.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransportCard {
  @PrimaryGeneratedColumn()
  cardNumber?: number;

  @Column()
  loadAmount: number;

  @Column()
  yearsOfValidity: number;

  @Column({
    type: 'enum',
    enum: TransportCardTypeEnum,
  })
  cardType: TransportCardTypeEnum;
}
