import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { BuilderModule } from './builder/builder.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    BuilderModule,
  ],
})
export class AppModule {}
