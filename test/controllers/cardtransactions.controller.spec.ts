import { Test, TestingModule } from '@nestjs/testing';
import { CardTransactionController } from '../../src/modules/cardtransactions/cardtransactions.controller';
import { CardTransactionService } from '../../src/modules/cardtransactions/cardtransactions.service';
import { HttpStatus } from '@nestjs/common';
import { InsufficientBalanceException } from '../../src/common/exceptions/insufficient-balance.exception';

describe('CardTransactionController', () => {
  let controller: CardTransactionController;
  let service: jest.Mocked<CardTransactionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardTransactionController],
      providers: [
        {
          provide: CardTransactionService,
          useValue: {
            processFareDeduction: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CardTransactionController>(
      CardTransactionController,
    );
    service = module.get(CardTransactionService);
  });

  describe('processFareDeduction', () => {
    it('should process fare deduction successfully', async () => {
      // Arrange
      const cardNumber = 123;
      const expectedResponse = 'Current balance: 500';

      service.processFareDeduction.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.processFareDeduction(cardNumber);

      // Assert
      expect(result).toBe(expectedResponse);
      expect(service.processFareDeduction).toHaveBeenCalledWith(cardNumber);
    });

    it('should throw InsufficientBalanceException when balance is insufficient', async () => {
      // Arrange
      const cardNumber = 123;
      service.processFareDeduction.mockRejectedValue(
        new InsufficientBalanceException('Insufficient balance on the card.'),
      );

      // Act & Assert
      await expect(controller.processFareDeduction(cardNumber)).rejects.toThrow(
        InsufficientBalanceException,
      );
      expect(service.processFareDeduction).toHaveBeenCalledWith(cardNumber);
    });
  });
});
