import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionHandler } from './common/exceptions/globalexception.handler';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiResponseFormatInterceptor } from './common/interceptors/api-response-format.interceptor';
import { RestApiResponse } from './common/dto/rest-api-response';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionHandler());
  app.useGlobalInterceptors(new ApiResponseFormatInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Transport Card API')
    .setDescription('API for managing transport cards and transactions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [RestApiResponse],
  });

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(8080);
}
bootstrap();
