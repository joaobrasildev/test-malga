import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@src/shared/config/config.module';
import { TypeOrmPersistenceModule } from '@src/shared/persistence/typeorm/typeorm-persistence.module';
import { Transaction } from './entity/transaction.entity';
import { TransactionHistory } from './entity/transaction-history.entity';
import { TransactionDetail } from './entity/transaction-details.entity';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionHistoryRepository } from './repository/transaction-history.repository';
import { TransactionDetailRepository } from './repository/transaction-detail.repository';

@Module({})
export class PersistenceModule {
  static forRoot(opts?: { migrations?: string[] }): DynamicModule {
    const { migrations } = opts || {};
    return {
      module: PersistenceModule,
      imports: [
        TypeOrmPersistenceModule.forRoot({
          migrations,
          entities: [Transaction, TransactionHistory, TransactionDetail],
        }),
        ConfigModule.forRoot(),
      ],
      providers: [
        TransactionRepository,
        TransactionHistoryRepository,
        TransactionDetailRepository,
      ],
      exports: [
        TransactionRepository,
        TransactionHistoryRepository,
        TransactionDetailRepository,
      ],
    };
  }
}
