import {
  ETransactionStatus,
  ETransactionStatusMessage,
} from '../enum/transaction.enum';

export interface IRefundProccesInput {
  externalTransactionId: string;
}

export interface IRefundProcessSuccessOutput {
  status: string;
  currency: string;
  transactionId: string;
  refundTransactionId: string;
  amount: number;
  refundProvider: string;
  date: Date;
}

export enum ERefundFailReason {
  INTEGRATOR = 'integrator',
}

export interface IRefundProccesFailOutput {
  status: ETransactionStatus;
  failReason: ERefundFailReason;
  message: ETransactionStatusMessage;
}
