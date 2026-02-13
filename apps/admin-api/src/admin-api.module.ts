import { Module } from '@nestjs/common';
import { AdminApiController } from './admin-api.controller';
import { AdminApiService } from './admin-api.service';
import { HealthController } from './health.controller';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [],
})
export class AdminApiModule {}
