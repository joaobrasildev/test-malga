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
    const transaction = this.modelToEntity(model);
    await this.repository.save(transaction);

    return this.entityToModel(transaction);
  }

  async updateTransaction(model: TransactionModel): Promise<TransactionModel> {
    const transaction = this.modelToEntity(model);
    await this.repository.update({ id: model.id }, transaction);

    return this.entityToModel(transaction);
  }

  async getTransactionByExternalId(
    externalTransactionId: string,
  ): Promise<TransactionModel | undefined> {
    const transaction = await this.repository.findOne({
      where: {
        externalTransactionId,
      },
    });
    if (!transaction) return;

    return this.entityToModel(transaction);
  }

  private entityToModel(entity: TransactionEntity): TransactionModel {
    return new TransactionModel({
      id: entity.id,
      externalTransactionId: entity.externalTransactionId,
      refundTransactionId: entity.refundTransactionId,
      paymentType: entity.paymentType,
      type: entity.type,
      status: entity.status,
      statusMessage: entity.statusMessage,
      processedBy: entity.processedBy,
      currency: entity.currency,
      amount: entity.amount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  private modelToEntity(model: TransactionModel): TransactionEntity {
    return new TransactionEntity({
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
  }
}
