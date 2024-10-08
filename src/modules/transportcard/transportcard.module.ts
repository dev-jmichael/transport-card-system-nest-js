import { Module } from '@nestjs/common';
import { TransportCardController } from './transportcard.controller';
import { TransportCardService } from './transportcard.service';
import { TransportCard } from './transportcard.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportCardMapper } from './mapper/transportcard.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportCard]), // Register the TransportCard entity in TypeORM
  ],
  controllers: [TransportCardController],
  providers: [TransportCardService, TransportCardMapper],
})
export class TransportCardModule {}
