import { Module } from '@nestjs/common';
import { AdminProductsController } from './products.controller';
import { AdminProductsService } from './products.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminProductsController],
  providers: [AdminProductsService],
})
export class AdminProductsModule {}
