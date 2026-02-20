import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HealthController } from './health.controller';
import {
  CorrelationIdMiddleware,
  RequestLoggingInterceptor,
  REQUEST_LOGGING_OPTIONS,
} from '@pbm/shared-logging';

import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from '@pbm/shared-domain';
import { PrismaModule } from 'libs/shared-data-access';


@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: envValidationSchema,
  }),
  PrismaModule,
],
  controllers: [HealthController],
  providers: [
    {
      provide: REQUEST_LOGGING_OPTIONS,
      useValue: { excludePaths: ['/health'] },
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
  ],
})
export class ConsumerApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
