import { NestFactory } from '@nestjs/core';
import { ConsumerApiModule } from './consumer-api.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerApiModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
