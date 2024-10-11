import { Test, TestingModule } from '@nestjs/testing';
import { CardTransactionService } from '../../src/modules/cardtransactions/cardtransactions.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransportCard } from '../../src/modules/transportcard/transportcard.entity';
import { CardNotFoundException } from '../../src/common/exceptions/card-not-found.exception';
import { InsufficientBalanceException } from '../../src/common/exceptions/insufficient-balance.exception';
import { TransportCardType } from '../../src/modules/transportcard/value-objects/transport-card-type';
import { TransportCardTypeEnum } from '../../src/modules/transportcard/value-objects/transport-card-type.enum';

describe('CardTransactionServiceTest', () => {
  let service: CardTransactionService;
  let repository: jest.Mocked<Repository<TransportCard>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardTransactionService,
        {
          provide: getRepositoryToken(TransportCard),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CardTransactionService>(CardTransactionService);
    repository = module.get(getRepositoryToken(TransportCard));
  });

  describe('processFareDeduction', () => {
    it('should process fare deduction successfully', async () => {
      // Arrange
      const cardNumber = 123;
      const initialBalance = 500;
      const fare = 10;
      const transportCard: TransportCard = {
        cardNumber,
        loadAmount: initialBalance,
        yearsOfValidity: 5,
        cardType: TransportCardTypeEnum.DISCOUNTED,
      };

      jest.spyOn(TransportCardType, 'getTransportCardType').mockReturnValue(
        new TransportCardType(
          500, // initialLoadAmount
          3, // yearsOfValidity
          fare, // fareRate
          0.2, // discountRate
          TransportCardTypeEnum.DISCOUNTED, // cardTypeEnum
        ),
      );

      repository.findOne.mockResolvedValue(transportCard);
      repository.save.mockResolvedValue(transportCard);

      // Act
      const result = await service.processFareDeduction(cardNumber);

      // Assert
      expect(result).toBe(transportCard);
      expect(transportCard.loadAmount).toBe(492);
      expect(repository.save).toHaveBeenCalledWith(transportCard);
    });

    it('should throw InsufficientBalanceException if balance is insufficient', async () => {
      // Arrange
      const cardNumber = 123;
      const balance = 10;
      const fare = 15;
      const transportCard: TransportCard = {
        cardNumber,
        loadAmount: balance,
        yearsOfValidity: 5,
        cardType: TransportCardTypeEnum.REGULAR,
      };

      jest.spyOn(TransportCardType, 'getTransportCardType').mockReturnValue(
        new TransportCardType(
          100, // initialLoadAmount
          5, // yearsOfValidity
          fare, // fareRate
          0, // discountRate
          TransportCardTypeEnum.REGULAR, // cardTypeEnum
        ),
      );

      repository.findOne.mockResolvedValue(transportCard);

      // Act & Assert
      await expect(service.processFareDeduction(cardNumber)).rejects.toThrow(
        InsufficientBalanceException,
      );
      expect(repository.save).not.toHaveBeenCalled(); // Ensure save is not called
    });

    it('should throw CardNotFoundException if card is not found', async () => {
      // Arrange
      const cardNumber = 123;

      repository.findOne.mockResolvedValue(null); // Card not found

      // Act & Assert
      await expect(service.processFareDeduction(cardNumber)).rejects.toThrow(
        CardNotFoundException,
      );
      expect(repository.save).not.toHaveBeenCalled(); // Ensure save is not called
    });
  });
});
