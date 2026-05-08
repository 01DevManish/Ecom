import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — allow storefront origins
  const origins = (process.env.CORS_ORIGINS || 'http://localhost:3001,http://localhost:3002,http://localhost:3003')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({ origin: origins, credentials: true });

  // Global API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4001;
  await app.listen(port);
  console.log(`🛒 EcomBackend running on http://localhost:${port}`);
}
bootstrap();
