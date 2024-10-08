import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportCardModule } from './modules/transportcard/transportcard.module';
import { TransportCard } from './modules/transportcard/transportcard.entity';
import { CardTransactionsModule } from './modules/cardtransactions/cardtransactions.module';

@Module({
  imports: [
    TransportCardModule,
    CardTransactionsModule,
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: 'localhost', // Database host
      port: 5432, // Default PostgreSQL port
      username: 'postgres', // Your PostgreSQL username
      password: 'postgres', // Your PostgreSQL password
      database: 'transport_card_system', // Your PostgreSQL database name
      entities: [TransportCard], // List of your entities
      synchronize: true, // Set to true in development to auto-sync entities with the database
    }),
    TypeOrmModule.forFeature([TransportCard]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
