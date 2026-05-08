import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AdminProductsModule } from './products/products.module';
import { SitesModule } from './sites/sites.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    AdminProductsModule,
    SitesModule,
  ],
})
export class AppModule {}
