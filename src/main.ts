import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — allow storefront origins
  const origins = (process.env.CORS_ORIGINS || 'http://localhost:3002')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({ origin: origins, credentials: true });

  // Global API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4002;
  await app.listen(port);
  console.log(`🛒 HC Backend running on http://localhost:${port}`);
}
bootstrap();
