import { WithOptional } from '@src/shared/core/model/default.model';
import { randomUUID } from 'crypto';
import {
  EIntegrator,
  EPaymentStatus,
  EPaymentStatusMessage,
  EPaymentType,
  EType,
} from '../enum/transaction.enum';

export class TransactionModel {
  id: string;
  paymentType: EPaymentType;
  type: EType;
  status: EPaymentStatus;
  statusMessage: EPaymentStatusMessage;
  processedBy: EIntegrator;
  currency: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(
    data: Omit<
      WithOptional<
        TransactionModel,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
      >,
      'type'
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
