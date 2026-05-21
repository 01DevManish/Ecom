import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { DatabaseModule } from '../database/database.module';
import { DynamoService } from './dynamo.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [DynamoService],
})
export class AdminModule {}
