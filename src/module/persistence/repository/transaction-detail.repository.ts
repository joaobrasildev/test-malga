import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DefaultTypeOrmRepository } from '@src/shared/persistence/typeorm/repository/default-typeorm.repository';
import { TransactionDetail } from '../entity/transaction-details.entity';

@Injectable()
export class TransactionDetailRepository extends DefaultTypeOrmRepository<TransactionDetail> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(TransactionDetail, dataSource);
  }
}
