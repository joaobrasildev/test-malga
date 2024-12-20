import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transaction } from '../entity/transaction.entity';
import { DefaultTypeOrmRepository } from '@src/shared/persistence/typeorm/repository/default-typeorm.repository';

@Injectable()
export class TransactionRepository extends DefaultTypeOrmRepository<Transaction> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(Transaction, dataSource);
  }
}
