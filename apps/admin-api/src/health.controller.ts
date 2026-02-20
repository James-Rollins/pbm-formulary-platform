import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard } from '@pbm/shared-auth';

@Controller('health')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class HealthController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}
