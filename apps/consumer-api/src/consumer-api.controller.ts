import { Controller, Get } from '@nestjs/common';
import { ConsumerApiService } from './consumer-api.service';

@Controller()
export class ConsumerApiController {
  constructor(private readonly consumerApiService: ConsumerApiService) {}

  @Get()
  getHello(): string {
    return this.consumerApiService.getHello();
  }
}
