import { EPaymentType } from '@src/module/core/enum/transaction.enum';
import { ICard } from '@src/module/core/interface/payment-proccess.interface';

export interface IPaymentStripeInput {
  amount: number;
  currency: string;
  description: string;
  paymentMethod: {
    type: EPaymentType;
    card: ICard;
  };
}

export enum EStatusStripe {
  AUTHORIZED = 'authorized',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface IPaymentStripeOutput {
  id: string;
  createdAt: Date;
  status: EStatusStripe;
  originalAmount: number;
  currentAmount: number;
  currency: string;
  description: string;
  paymentMethod: EPaymentType;
  cardId: string;
}

export interface IRefundStripeInput {
  id: string;
  amount: number;
}

export interface IRefundStripeOutput {
  id: string;
  createdAt: Date;
  status: EStatusStripe;
  originalAmount: number;
  currentAmount: number;
  currency: string;
  description: string;
  paymentMethod: EPaymentType;
  cardId: string;
}

export interface IGetTransactionStripeOutput {
  id: string;
  createdAt: Date;
  status: EStatusStripe;
  originalAmount: number;
  currentAmount: number;
  currency: string;
  description: string;
  paymentMethod: EPaymentType;
  cardId: string;
}
