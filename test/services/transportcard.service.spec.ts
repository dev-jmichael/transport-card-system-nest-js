import { Test, TestingModule } from '@nestjs/testing';
import { TransportCardService } from '../../src/modules/transportcard/transportcard.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransportCard } from '../../src/modules/transportcard/transportcard.entity';
import { TransportCardMapper } from '../../src/modules/transportcard/mapper/transportcard.mapper'; // Assuming the mapper is injected
import { CreateTransportCardRequest } from '../../src/modules/transportcard/dto/create-transport-card-request';
import { TransportCardResponse } from '../../src/modules/transportcard/dto/transport-card-response';
import { CardNotFoundException } from '../../src/common/exceptions/card-not-found.exception';
import {
  TransportCardType,
  TransportCardTypeEnum,
} from '../../src/common/constants/transportcard.type'; // Assuming this is your class for card type

describe('TransportCardService', () => {
  let service: TransportCardService;
  let repository: jest.Mocked<Repository<TransportCard>>;
  let mapper: jest.Mocked<TransportCardMapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportCardService,
        {
          provide: getRepositoryToken(TransportCard),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: TransportCardMapper,
          useValue: {
            toDTO: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransportCardService>(TransportCardService);
    repository = module.get(getRepositoryToken(TransportCard));
    mapper = module.get(TransportCardMapper);
  });

  describe('createTransportCard', () => {
    it('should create a new transport card successfully', async () => {
      // Arrange
      const request: CreateTransportCardRequest = {
        cardType: 'Discounted',
      };
      const transportCardType = new TransportCardType(
        500,
        3,
        10,
        0.2,
        TransportCardTypeEnum.DISCOUNTED,
      );
      jest
        .spyOn(TransportCardType, 'getTransportCardType')
        .mockReturnValue(transportCardType);

      const transportCard: TransportCard = {
        cardNumber: 1,
        loadAmount: 500,
        yearsOfValidity: 3,
        cardType: TransportCardTypeEnum.DISCOUNTED,
      };

      repository.save.mockResolvedValue(transportCard);
      mapper.toDTO.mockReturnValue({
        cardNumber: 1,
        loadAmount: 500,
        yearsOfValidity: 3,
        cardType: TransportCardTypeEnum.DISCOUNTED,
      });

      // Act
      const result = await service.createTransportCard(request);

      // Assert
      expect(result).toEqual({
        cardNumber: 1,
        loadAmount: 500,
        yearsOfValidity: 3,
        cardType: 'Discounted',
      });
      expect(repository.save).toHaveBeenCalledWith({
        loadAmount: 500,
        yearsOfValidity: 3,
        cardType: TransportCardTypeEnum.DISCOUNTED,
      });
      expect(mapper.toDTO).toHaveBeenCalledWith(transportCard);
    });
  });

  describe('getAllTransportCards', () => {
    it('should fetch all transport cards successfully', async () => {
      // Arrange
      const transportCards: TransportCard[] = [
        {
          cardNumber: 1,
          loadAmount: 500,
          yearsOfValidity: 3,
          cardType: TransportCardTypeEnum.DISCOUNTED,
        },
        {
          cardNumber: 2,
          loadAmount: 100,
          yearsOfValidity: 5,
          cardType: TransportCardTypeEnum.REGULAR,
        },
      ];

      repository.find.mockResolvedValue(transportCards);
      mapper.toDTO
        .mockReturnValueOnce({
          cardNumber: 1,
          loadAmount: 500,
          yearsOfValidity: 3,
          cardType: TransportCardTypeEnum.DISCOUNTED,
        })
        .mockReturnValueOnce({
          cardNumber: 2,
          loadAmount: 100,
          yearsOfValidity: 5,
          cardType: TransportCardTypeEnum.REGULAR,
        });

      // Act
      const result = await service.getAllTransportCards();

      // Assert
      expect(result).toEqual([
        {
          cardNumber: 1,
          loadAmount: 500,
          yearsOfValidity: 3,
          cardType: 'Discounted',
        },
        {
          cardNumber: 2,
          loadAmount: 100,
          yearsOfValidity: 5,
          cardType: 'Regular',
        },
      ]);
      expect(repository.find).toHaveBeenCalled();
      expect(mapper.toDTO).toHaveBeenCalledTimes(2); // Ensures that toDTO is called for each transport card
    });
  });

  describe('getTransportCardById', () => {
    it('should fetch transport card by ID successfully', async () => {
      // Arrange
      const cardNumber = 1;
      const transportCard: TransportCard = {
        cardNumber,
        loadAmount: 500,
        yearsOfValidity: 3,
        cardType: TransportCardTypeEnum.DISCOUNTED,
      };

      repository.findOne.mockResolvedValue(transportCard);
      mapper.toDTO.mockReturnValue({
        cardNumber: 1,
        loadAmount: 500,
        yearsOfValidity: 3,
        cardType: TransportCardTypeEnum.DISCOUNTED,
      });

      // Act
      const result = await service.getTransportCardById(cardNumber);

      // Assert
      expect(result).toEqual({
        cardNumber: 1,
        loadAmount: 500,
        yearsOfValidity: 3,
        cardType: 'Discounted',
      });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { cardNumber },
      });
      expect(mapper.toDTO).toHaveBeenCalledWith(transportCard);
    });

    it('should throw CardNotFoundException if transport card is not found', async () => {
      // Arrange
      const cardNumber = 1;
      repository.findOne.mockResolvedValue(null); // Simulate card not found

      // Act & Assert
      await expect(service.getTransportCardById(cardNumber)).rejects.toThrow(
        new CardNotFoundException(
          `Transport card with card number ${cardNumber} not found`,
        ),
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { cardNumber },
      });
      expect(mapper.toDTO).not.toHaveBeenCalled();
    });
  });
});
