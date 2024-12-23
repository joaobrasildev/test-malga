import { WithOptional } from '@src/shared/core/model/default.model';
import { randomUUID } from 'crypto';
import { EPaymentType } from '../enum/transaction.enum';

export class TransactionDetailModel {
  id: string;
  transactionId: string;
  type: EPaymentType;
  cardNumber: string;
  holderName: string;
  cvv: string;
  expirationDate: string;
  installments: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(
    data: WithOptional<
      TransactionDetailModel,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ) {
    Object.assign(this, {
      ...data,
      id: data.id ? data.id : randomUUID(),
      createdAt: data.createdAt || Date.now(),
      updatedAt: data.updatedAt || Date.now(),
      deletedAt: data.deletedAt,
    });
  }
}
