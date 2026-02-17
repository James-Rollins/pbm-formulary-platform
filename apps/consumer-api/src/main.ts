import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConsumerApiModule } from './consumer-api.module';
import { HttpExceptionFilter } from '@pbm/shared-logging';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(ConsumerApiModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  });

  // Global exception handling (consistent error shape)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation (DTO safety)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('CONSUMER_PORT');
  await app.listen(port);

  console.log(`Consumer API running on http://localhost:${port}`);
}

bootstrap();
