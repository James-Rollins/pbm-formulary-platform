import { Module } from '@nestjs/common';
import { ConsumerApiController } from './consumer-api.controller';
import { ConsumerApiService } from './consumer-api.service';
import { HealthController } from './health.controller';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [],
})
export class ConsumerApiModule {}
