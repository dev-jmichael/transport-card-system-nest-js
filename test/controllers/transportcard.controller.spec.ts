import { Test, TestingModule } from '@nestjs/testing';
import { TransportCardController } from '../../src/modules/transportcard/transportcard.controller';
import { TransportCardService } from '../../src/modules/transportcard/transportcard.service';
import { CreateTransportCardRequest } from '../../src/modules/transportcard/dto/create-transport-card-request';
import { TransportCardResponse } from '../../src/modules/transportcard/dto/transport-card-response';
import { RestApiResponse } from '../../src/common/dto/rest-api-response';
import { NotFoundException } from '@nestjs/common';
import { TransportCardTypeEnum } from '../../src/common/constants/transportcard.type';

describe('TransportCardController', () => {
  let controller: TransportCardController;
  let service: jest.Mocked<TransportCardService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportCardController],
      providers: [
        {
          provide: TransportCardService,
          useValue: {
            createTransportCard: jest.fn(),
            getAllTransportCards: jest.fn(),
            getTransportCardById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransportCardController>(TransportCardController);
    service = module.get(TransportCardService);
  });

  describe('createTransportCard', () => {
    it('should create a new transport card successfully', async () => {
      // Arrange
      const request: CreateTransportCardRequest = {
        cardType: 'Regular',
      };
      const response: TransportCardResponse = {
        cardNumber: 1,
        loadAmount: 100,
        yearsOfValidity: 5,
        cardType: TransportCardTypeEnum.REGULAR,
      };
      service.createTransportCard.mockResolvedValue(response);

      // Act
      const result = await controller.createTransportCard(request);

      // Assert
      expect(result).toEqual(new RestApiResponse(true, response));
      expect(service.createTransportCard).toHaveBeenCalledWith(request);
    });

    it('should throw bad request for invalid card type', async () => {
      // Arrange
      const request: CreateTransportCardRequest = {
        cardType: 'INVALID',
      };
      service.createTransportCard.mockRejectedValue(
        new Error('Invalid card type exception.'),
      );

      // Act & Assert
      await expect(controller.createTransportCard(request)).rejects.toThrow(
        'Invalid card type exception',
      );
      expect(service.createTransportCard).toHaveBeenCalledWith(request);
    });
  });

  describe('getAllTransportCards', () => {
    it('should retrieve all transport cards successfully', async () => {
      // Arrange
      const response: TransportCardResponse[] = [
        {
          cardNumber: 1,
          loadAmount: 100,
          yearsOfValidity: 5,
          cardType: TransportCardTypeEnum.REGULAR,
        },
        {
          cardNumber: 2,
          loadAmount: 500,
          yearsOfValidity: 3,
          cardType: TransportCardTypeEnum.DISCOUNTED,
        },
      ];
      service.getAllTransportCards.mockResolvedValue(response);

      // Act
      const result = await controller.getAllTransportCards();

      // Assert
      expect(result).toEqual(new RestApiResponse(true, response));
      expect(service.getAllTransportCards).toHaveBeenCalled();
    });
  });

  describe('getTransportCardById', () => {
    it('should retrieve transport card by card number successfully', async () => {
      // Arrange
      const cardNumber = 1;
      const response: TransportCardResponse = {
        cardNumber,
        loadAmount: 100,
        yearsOfValidity: 5,
        cardType: TransportCardTypeEnum.REGULAR,
      };
      service.getTransportCardById.mockResolvedValue(response);

      // Act
      const result = await controller.getTransportCardById(cardNumber);

      // Assert
      expect(result).toEqual(new RestApiResponse(true, response));
      expect(service.getTransportCardById).toHaveBeenCalledWith(cardNumber);
    });

    it('should throw NotFoundException when transport card is not found', async () => {
      // Arrange
      const cardNumber = 1;
      service.getTransportCardById.mockResolvedValue(null);

      // Act & Assert
      await expect(controller.getTransportCardById(cardNumber)).rejects.toThrow(
        new NotFoundException(`Card with number ${cardNumber} not found`),
      );
      expect(service.getTransportCardById).toHaveBeenCalledWith(cardNumber);
    });
  });
});
