import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionEntity } from '../entity/transaction.entity';
import { DefaultTypeOrmRepository } from '@src/shared/persistence/typeorm/repository/default-typeorm.repository';

@Injectable()
export class TransactionRepository extends DefaultTypeOrmRepository<TransactionEntity> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(TransactionEntity, dataSource);
  }
  async saveTransaction();
}
