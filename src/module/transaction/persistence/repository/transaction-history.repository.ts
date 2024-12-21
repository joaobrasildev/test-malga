import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DefaultTypeOrmRepository } from '@src/shared/persistence/typeorm/repository/default-typeorm.repository';
import { TransactionHistoryEntity } from '../entity/transaction-history.entity';

@Injectable()
export class TransactionHistoryRepository extends DefaultTypeOrmRepository<TransactionHistoryEntity> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(TransactionHistoryEntity, dataSource);
  }
}
