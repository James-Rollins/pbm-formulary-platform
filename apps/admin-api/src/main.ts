import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AdminApiModule } from './admin-api.module';
import { HttpExceptionFilter } from '@pbm/shared-logging';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AdminApiModule, {
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

  // Consistent error shape
  app.useGlobalFilters(new HttpExceptionFilter());

  // DTO safety
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Optional: good hygiene for containers
  // app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('ADMIN_PORT');
  await app.listen(port);

  console.log(`Admin API running on http://localhost:${port}`);
}

bootstrap();
