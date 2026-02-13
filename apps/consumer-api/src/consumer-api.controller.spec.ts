import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerApiController } from './consumer-api.controller';
import { ConsumerApiService } from './consumer-api.service';

describe('ConsumerApiController', () => {
  let consumerApiController: ConsumerApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsumerApiController],
      providers: [ConsumerApiService],
    }).compile();

    consumerApiController = app.get<ConsumerApiController>(ConsumerApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(consumerApiController.getHello()).toBe('Hello World!');
    });
  });
});
