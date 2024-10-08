import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportCard } from '../transportcard/transportcard.entity';
import { CardTransactionController } from './cardtransactions.controller';
import { CardTransactionService } from './cardtransactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportCard]), // Register the TransportCard entity in TypeORM
  ],
  controllers: [CardTransactionController],
  providers: [CardTransactionService],
})
export class CardTransactionsModule {}
