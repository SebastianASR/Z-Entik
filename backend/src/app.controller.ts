import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHome() {
    return {
      app: 'Z-Entik API',
      status: 'running',
      message: 'Backend NestJS funcionando correctamente',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'Z-Entik API',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/db')
  async getDatabaseHealth() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      service: 'Z-Entik API',
      database: 'PostgreSQL',
      orm: 'Prisma',
      timestamp: new Date().toISOString(),
    };
  }
}
