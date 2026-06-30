import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configuredPort = Number(process.env.PORT);
  const basePort = Number.isInteger(configuredPort) ? configuredPort : 3000;
  const maxOffset = 10;
  const portsToTry = Array.from(
    { length: maxOffset + 1 },
    (_, i) => basePort + i,
  );

  for (const port of portsToTry) {
    try {
      await app.listen(port);
      if (port !== basePort) {
        console.warn(
          `Puerto ${basePort} estaba en uso. El servidor se inició en el puerto ${port} en su lugar.`,
        );
      }
      const url = await app.getUrl();
      console.log(`Servidor iniciado en ${url}`);
      return;
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? (error as { code?: string }).code
          : undefined;

      if (code !== 'EADDRINUSE') {
        throw error;
      }

      // If this was the last port to try, break and fall back to port 0
      if (port === portsToTry[portsToTry.length - 1]) {
        console.warn(
          `Todos los puertos ${basePort}-${basePort + maxOffset} están en uso. Intentando un puerto aleatorio del sistema...`,
        );
        break;
      }

      console.warn(`Puerto ${port} en uso, probando el puerto ${port + 1}...`);
    }
  }

  // Fallback: let the OS pick an available port
  await app.listen(0);
  const url = await app.getUrl();
  console.warn(`Se inició en un puerto aleatorio: ${url}`);
  return;
}

void bootstrap().catch((error: unknown) => {
  console.error('Error al iniciar Z-Entik API:', error);
  process.exit(1);
});
