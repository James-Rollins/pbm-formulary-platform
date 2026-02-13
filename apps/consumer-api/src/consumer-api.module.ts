import { Module } from '@nestjs/common';
import { ConsumerApiController } from './consumer-api.controller';
import { ConsumerApiService } from './consumer-api.service';

@Module({
  imports: [],
  controllers: [ConsumerApiController],
  providers: [ConsumerApiService],
})
export class ConsumerApiModule {}
