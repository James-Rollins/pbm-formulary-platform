import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@pbm/shared-auth';

@Controller('health')
@UseGuards(JwtAuthGuard)
export class HealthController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}
