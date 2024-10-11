import { Test, TestingModule } from '@nestjs/testing';
import { CardTransactionController } from '../../src/modules/cardtransactions/cardtransactions.controller';
import { CardTransactionService } from '../../src/modules/cardtransactions/cardtransactions.service';
import { InsufficientBalanceException } from '../../src/common/exceptions/insufficient-balance.exception';
import { TransportCard } from '../../src/modules/transportcard/transportcard.entity';
import { TransportCardTypeEnum } from '../../src/modules/transportcard/value-objects/transport-card-type.enum';

describe('CardTransactionController', () => {
  let controller: CardTransactionController;
  let service: CardTransactionService;

  const mockTransportCard = {
    cardNumber: 12345,
    cardType: 'REGULAR',
    loadAmount: 100,
  };

  const mockService = {
    processFarePayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardTransactionController],
      providers: [
        {
          provide: CardTransactionService,
          useValue: mockService, // Provide mock service
        },
      ],
    }).compile();

    controller = module.get<CardTransactionController>(
      CardTransactionController,
    );
    service = module.get<CardTransactionService>(CardTransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should process fare deduction successfully and return the transport card', async () => {
    // Mock service to return a valid transport card
    mockService.processFarePayment.mockResolvedValue(mockTransportCard);

    const result = await controller.processFarePayment(12345);

    expect(result).toEqual(mockTransportCard); // Check if response is the mock transport card
    expect(service.processFarePayment).toHaveBeenCalledWith(12345);
  });

  it('should throw InsufficientBalanceException if balance is too low', async () => {
    // Mock service to throw InsufficientBalanceException
    mockService.processFarePayment.mockRejectedValue(
      new InsufficientBalanceException('Insufficient balance on the card.'),
    );

    await expect(controller.processFarePayment(12345)).rejects.toThrow(
      InsufficientBalanceException,
    );
    expect(service.processFarePayment).toHaveBeenCalledWith(12345);
  });
});
