import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DefaultTypeOrmRepository } from '@src/shared/persistence/typeorm/repository/default-typeorm.repository';
import { TransactionHistoryEntity } from '../entity/transaction-history.entity';
import { TransactionHistoryModel } from '../../core/model/transaction-history.model';

@Injectable()
export class TransactionHistoryRepository extends DefaultTypeOrmRepository<TransactionHistoryEntity> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(TransactionHistoryEntity, dataSource);
  }
  async saveTransactionHistory(
    model: TransactionHistoryModel,
  ): Promise<TransactionHistoryModel> {
    const transactionHistory = new TransactionHistoryEntity({
      transactionId: model.transactionId,
      paymentType: model.paymentType,
      type: model.type,
      status: model.status,
      statusMessage: model.statusMessage,
      processedBy: model.processedBy,
      currency: model.currency,
      amount: model.amount,
    });
    await this.repository.save(transactionHistory);

    return new TransactionHistoryModel({
      id: transactionHistory.id,
      transactionId: transactionHistory.transactionId,
      paymentType: transactionHistory.paymentType,
      type: transactionHistory.type,
      status: transactionHistory.status,
      statusMessage: transactionHistory.statusMessage,
      processedBy: transactionHistory.processedBy,
      currency: transactionHistory.currency,
      amount: transactionHistory.amount,
      createdAt: transactionHistory.createdAt,
      updatedAt: transactionHistory.updatedAt,
      deletedAt: transactionHistory.deletedAt,
    });
  }
}
