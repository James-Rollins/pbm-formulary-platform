import { Test, TestingModule } from '@nestjs/testing';
import { SharedLoggingService } from './shared-logging.service';

describe('SharedLoggingService', () => {
  let service: SharedLoggingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedLoggingService],
    }).compile();

    service = module.get<SharedLoggingService>(SharedLoggingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
