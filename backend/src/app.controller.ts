import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
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
}
