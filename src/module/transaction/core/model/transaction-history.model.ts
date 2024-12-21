import { WithOptional } from '@src/shared/core/model/default.model';
import { randomUUID } from 'crypto';
import {
  EIntegrator,
  EPaymentStatus,
  EPaymentType,
  EType,
} from '../enum/transaction.enum';

export class TransactionHistoryModel {
  id: string;
  transactionId: string;
  paymentType: EPaymentType;
  type: EType;
  status: EPaymentStatus;
  statusMessage: string;
  processedBy: EIntegrator;
  currency: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(
    data: WithOptional<
      TransactionHistoryModel,
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
