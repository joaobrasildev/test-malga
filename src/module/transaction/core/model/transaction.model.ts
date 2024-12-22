import { WithOptional } from '@src/shared/core/model/default.model';
import { randomUUID } from 'crypto';
import {
  EIntegrator,
  ETransactionStatus,
  EPaymentType,
  EType,
} from '../enum/transaction.enum';

export class TransactionModel {
  id: string;
  paymentType: EPaymentType;
  type: EType;
  status: ETransactionStatus;
  statusMessage: string;
  processedBy: EIntegrator;
  currency: string;
  amount: number;
  externalTransactionId: string | undefined;
  refundTransactionId: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(
    data: WithOptional<
      TransactionModel,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'externalTransactionId'
      | 'refundTransactionId'
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
