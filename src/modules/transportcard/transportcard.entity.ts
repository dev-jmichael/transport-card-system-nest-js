import { TransportCardTypeEnum } from '../../common/constants/transportcard.type';
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
