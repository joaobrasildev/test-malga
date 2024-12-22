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
    const transactionDetail = this.modelToEntity(model);
    await this.repository.save(transactionDetail);

    return this.entityToModel(transactionDetail);
  }

  async getDetailByTransactionId(
    transactionId: string,
  ): Promise<TransactionDetailModel | undefined> {
    const transactionDetail = await this.repository.findOne({
      where: {
        transactionId,
      },
    });
    if (!transactionDetail) return;

    return this.entityToModel(transactionDetail);
  }

  private entityToModel(
    entity: TransactionDetailEntity,
  ): TransactionDetailModel {
    return new TransactionDetailModel({
      id: entity.id,
      transactionId: entity.transactionId,
      type: entity.type,
      cardNumber: entity.cardNumber,
      holderName: entity.holderName,
      cvv: entity.cvv,
      expirationDate: entity.expirationDate,
      installments: entity.installments,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  private modelToEntity(
    model: TransactionDetailModel,
  ): TransactionDetailEntity {
    return new TransactionDetailEntity({
      transactionId: model.transactionId,
      type: model.type,
      cardNumber: model.cardNumber,
      holderName: model.holderName,
      cvv: model.cvv,
      expirationDate: model.expirationDate,
      installments: model.installments,
    });
  }
}
