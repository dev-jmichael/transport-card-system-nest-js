import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  HttpCode,
  Logger,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { TransportCardService } from './transportcard.service';
import { CreateTransportCardRequest } from './dto/create-transport-card-request';
import { TransportCardResponse } from './dto/transport-card-response';
import { RestApiResponse } from '../../common/dto/rest-api-response';

@ApiTags('Transport Card')
@Controller('api/v1/transport-cards')
export class TransportCardController {
  private readonly logger = new Logger(TransportCardController.name);

  constructor(private readonly service: TransportCardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new transport card',
    description: 'Creates a new transport card and returns the card details.',
  })
  @ApiResponse({
    status: 201,
    description: 'Transport card created successfully.',
    schema: {
      type: 'object',
      $ref: getSchemaPath(RestApiResponse),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation issues',
    content: {
      'application/json': {
        examples: {
          InvalidCardType: {
            summary: 'Invalid card type',
            value: { message: 'Invalid card type exception.' },
          },
          EmptyCardType: {
            summary: 'Empty card type',
            value: { message: 'Card type cannot be empty.' },
          },
        },
      },
    },
  })
  async createTransportCard(
    @Body() request: CreateTransportCardRequest,
  ): Promise<TransportCardResponse> {
    this.logger.log(
      `Received request to create transport card for type: ${request.cardType}`,
    );
    const response = await this.service.createTransportCard(request);
    this.logger.log(
      `Successfully created transport card with card number: ${response.cardNumber}`,
    );
    return response;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve all transport cards',
    description: 'Retrieves all transport cards with their details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all transport cards.',
    schema: {
      type: 'object',
      $ref: getSchemaPath(RestApiResponse),
    },
  })
  async getAllTransportCards(): Promise<TransportCardResponse[]> {
    this.logger.log('Received request to retrieve all transport cards');
    const response = await this.service.getAllTransportCards();
    this.logger.log(
      `Successfully retrieved ${response.length} transport cards`,
    );
    return response;
  }

  @Get(':cardNumber')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve transport card by card number',
    description: 'Retrieves specific card details by card number.',
  })
  @ApiParam({
    name: 'cardNumber',
    required: true,
    description: 'The card number to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved transport card.',
    schema: {
      type: 'object',
      $ref: getSchemaPath(RestApiResponse),
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found exception.',
  })
  async getTransportCardById(
    @Param('cardNumber', ParseIntPipe) cardNumber: number,
  ): Promise<TransportCardResponse> {
    this.logger.log(
      `Received request to retrieve transport card with card number: ${cardNumber}`,
    );
    const response = await this.service.getTransportCardById(cardNumber);
    if (!response) {
      this.logger.warn(`Card with number ${cardNumber} not found`);
      throw new NotFoundException(`Card with number ${cardNumber} not found`);
    }
    this.logger.log(
      `Successfully retrieved transport card with card number: ${cardNumber}`,
    );
    return response;
  }
}
