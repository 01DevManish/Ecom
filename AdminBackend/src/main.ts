import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — only Admin Panel allowed
  const origins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({ origin: origins, credentials: true });

  // Global API prefix
  app.setGlobalPrefix('api/admin');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🔐 AdminBackend running on http://localhost:${port}`);
}
bootstrap();
