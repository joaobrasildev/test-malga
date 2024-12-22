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

    return this.entityToModel(transactionHistory);
  }

  async getHistoryByTransactionId(
    transactionId: string,
  ): Promise<TransactionHistoryModel[] | undefined> {
    const transactionHistories = await this.repository.find({
      where: {
        transactionId,
      },
    });
    if (!transactionHistories) return;

    return this.entitiesToModels(transactionHistories);
  }

  private entitiesToModels(
    entities: TransactionHistoryEntity[],
  ): TransactionHistoryModel[] {
    return entities.map((entity) => this.entityToModel(entity));
  }

  private entityToModel(
    entity: TransactionHistoryEntity,
  ): TransactionHistoryModel {
    return new TransactionHistoryModel({
      id: entity.id,
      transactionId: entity.transactionId,
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
}
