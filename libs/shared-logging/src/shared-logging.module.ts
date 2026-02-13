import { Module } from '@nestjs/common';
import { SharedLoggingService } from './shared-logging.service';

@Module({
  providers: [SharedLoggingService],
  exports: [SharedLoggingService],
})
export class SharedLoggingModule {}
