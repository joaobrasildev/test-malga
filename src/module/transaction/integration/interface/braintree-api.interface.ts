import { EPaymentType } from '@src/module/transaction/core/enum/transaction.enum';
import { ICard } from '@src/module/transaction/core/interface/payment-process.interface';

export interface IPaymentBraintreeInput {
  amount: number;
  currency: string;
  statementDescriptor: string;
  paymentType: EPaymentType;
  card: ICard;
}

export enum EStatusBraintree {
  PAID = 'paid',
  FAILED = 'failed',
  VOIDED = 'voided',
}

export interface IPaymentBraintreeOutput {
  id: string;
  date: Date;
  status: EStatusBraintree;
  originalAmount: number;
  amount: number;
  currency: string;
  statementDescriptor: string;
  paymentType: EPaymentType;
  cardId: string;
}

export interface IRefundBraintreeInput {
  id: string;
  amount: number;
}

export interface IRefundBraintreeOutput {
  id: string;
  date: Date;
  status: EStatusBraintree;
  originalAmount: number;
  amount: number;
  currency: string;
  statementDescriptor: string;
  paymentType: EPaymentType;
  cardId: string;
}

export interface IGetTransactionBraintreeOutput {
  id: string;
  date: Date;
  status: EStatusBraintree;
  originalAmount: number;
  amount: number;
  currency: string;
  statementDescriptor: string;
  paymentType: EPaymentType;
  cardId: string;
}
