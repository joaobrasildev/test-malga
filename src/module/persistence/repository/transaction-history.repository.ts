import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DefaultTypeOrmRepository } from '@src/shared/persistence/typeorm/repository/default-typeorm.repository';
import { TransactionHistory } from '../entity/transaction-history.entity';

@Injectable()
export class TransactionHistoryRepository extends DefaultTypeOrmRepository<TransactionHistory> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(TransactionHistory, dataSource);
  }
}
