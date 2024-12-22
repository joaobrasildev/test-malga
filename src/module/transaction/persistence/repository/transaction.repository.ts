import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionEntity } from '../entity/transaction.entity';
import { DefaultTypeOrmRepository } from '@src/shared/persistence/typeorm/repository/default-typeorm.repository';
import { TransactionModel } from '../../core/model/transaction.model';

@Injectable()
export class TransactionRepository extends DefaultTypeOrmRepository<TransactionEntity> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(TransactionEntity, dataSource);
  }
  async saveTransaction(model: TransactionModel): Promise<TransactionModel> {
    const transaction = new TransactionEntity({
      id: model.id,
      paymentType: model.paymentType,
      type: model.type,
      status: model.status,
      statusMessage: model.statusMessage,
      processedBy: model.processedBy,
      currency: model.currency,
      amount: model.amount,
    });
    await this.repository.save(transaction);

    return new TransactionModel({
      id: transaction.id,
      paymentType: transaction.paymentType,
      type: transaction.type,
      status: transaction.status,
      statusMessage: transaction.statusMessage,
      processedBy: transaction.processedBy,
      currency: transaction.currency,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      deletedAt: transaction.deletedAt,
    });
  }

  async updateTransaction(model: TransactionModel): Promise<TransactionModel> {
    const transaction = new TransactionEntity({
      id: model.id,
      externalTransactionId: model.externalTransactionId,
      paymentType: model.paymentType,
      type: model.type,
      status: model.status,
      statusMessage: model.statusMessage,
      processedBy: model.processedBy,
      currency: model.currency,
      amount: model.amount,
    });
    await this.repository.update({ id: model.id }, transaction);

    return new TransactionModel({
      id: transaction.id,
      externalTransactionId: transaction.externalTransactionId,
      paymentType: transaction.paymentType,
      type: transaction.type,
      status: transaction.status,
      statusMessage: transaction.statusMessage,
      processedBy: transaction.processedBy,
      currency: transaction.currency,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      deletedAt: transaction.deletedAt,
    });
  }
}
