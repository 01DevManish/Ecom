import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({ origin: origins, credentials: true });

  // Prefix should be just 'api' because controllers handle 'admin' or 'auth'
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🔐 AdminBackend running on http://localhost:${port}`);
}
bootstrap();
