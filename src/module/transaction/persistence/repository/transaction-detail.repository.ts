import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DefaultTypeOrmRepository } from '@src/shared/persistence/typeorm/repository/default-typeorm.repository';
import { TransactionDetailEntity } from '../entity/transaction-details.entity';
import { TransactionDetailModel } from '../../core/model/transaction-detail.model';

@Injectable()
export class TransactionDetailRepository extends DefaultTypeOrmRepository<TransactionDetailEntity> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(TransactionDetailEntity, dataSource);
  }

  async saveTransactionDetail(
    model: TransactionDetailModel,
  ): Promise<TransactionDetailModel> {
    const transactionDetail = new TransactionDetailEntity({
      transactionId: model.transactionId,
      type: model.type,
      cardNumber: model.cardNumber,
      holderName: model.holderName,
      cvv: model.cvv,
      expirationDate: model.expirationDate,
      installments: model.installments,
    });
    await this.repository.save(transactionDetail);

    return new TransactionDetailModel({
      id: transactionDetail.id,
      transactionId: transactionDetail.transactionId,
      type: transactionDetail.type,
      cardNumber: transactionDetail.cardNumber,
      holderName: transactionDetail.holderName,
      cvv: transactionDetail.cvv,
      expirationDate: transactionDetail.expirationDate,
      installments: transactionDetail.installments,
      createdAt: transactionDetail.createdAt,
      updatedAt: transactionDetail.updatedAt,
      deletedAt: transactionDetail.deletedAt,
    });
  }
}
