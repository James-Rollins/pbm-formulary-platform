import { NestFactory } from '@nestjs/core';
import { AdminApiModule } from './admin-api.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminApiModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Admin API running on http://localhost:${port}`);

}
bootstrap();
