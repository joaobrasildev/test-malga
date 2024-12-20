import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@src/shared/config/config.module';
import { TypeOrmPersistenceModule } from '@src/shared/persistence/typeorm/typeorm-persistence.module';
import { Transaction } from './entity/transaction.entity';
import { TransactionHistory } from './entity/transaction-history.entity';
import { TransactionDetails } from './entity/transaction-details.entity';

@Module({})
export class PersistenceModule {
  static forRoot(opts?: { migrations?: string[] }): DynamicModule {
    const { migrations } = opts || {};
    return {
      module: PersistenceModule,
      imports: [
        TypeOrmPersistenceModule.forRoot({
          migrations,
          entities: [Transaction, TransactionHistory, TransactionDetails],
        }),
        ConfigModule.forRoot(),
      ],
      providers: [],
      exports: [],
    };
  }
}
