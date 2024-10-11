import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportCardModule } from './modules/transportcard/transportcard.module';
import { CardTransactionsModule } from './modules/cardtransactions/cardtransactions.module';
import { dbConfig } from './common/config/db';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransportCardModule,
    CardTransactionsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => dbConfig(configService),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
