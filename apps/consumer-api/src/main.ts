import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConsumerApiModule } from './consumer-api.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerApiModule);

  // Global validation (DTO safety)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Consumer API running on http://localhost:${port}`);
}

bootstrap();

