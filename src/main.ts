import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionHandler } from './common/exceptions/globalexception.handler';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiResponseFormatInterceptor } from './common/interceptors/api-response-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionHandler());
  app.useGlobalInterceptors(new ApiResponseFormatInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Transport Card API')
    .setDescription('API for managing transport cards and transactions')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(8080);
}
bootstrap();
