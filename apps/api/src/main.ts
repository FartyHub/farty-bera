import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { transformValidationErrors } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: process.env.ALLOW_ORIGINS?.split(','),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const result = validationErrors.reduce((errors, error) => {
          const transformedErrors = transformValidationErrors(error);

          return [...errors, ...transformedErrors];
        }, []);

        return new BadRequestException(result);
      },
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  const openAPIOptions = new DocumentBuilder()
    .setTitle('Farty Bera API')
    .setDescription('Farty Bera API Specification')
    .setVersion('0.1')
    .build();

  const openAPIDocument = SwaggerModule.createDocument(app, openAPIOptions);
  SwaggerModule.setup('api-docs', app, openAPIDocument);

  // eslint-disable-next-line no-magic-numbers
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
