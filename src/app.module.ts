import { Module } from '@nestjs/common';
import { ConfigModule } from './shared/module/config/config.module';
import { TransactionModule } from './module/transaction/transaction.module';

@Module({
  imports: [ConfigModule.forRoot(), TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
