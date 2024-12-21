import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@src/shared/module/config/config.module';
import { TypeOrmPersistenceModule } from '@src/shared/persistence/typeorm/typeorm-persistence.module';
import { TransactionEntity } from './entity/transaction.entity';
import { TransactionHistoryEntity } from './entity/transaction-history.entity';
import { TransactionDetailEntity } from './entity/transaction-details.entity';
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
          entities: [
            TransactionEntity,
            TransactionHistoryEntity,
            TransactionDetailEntity,
          ],
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
