import {
  ETransactionStatus,
  ETransactionStatusMessage,
  EPaymentType,
} from '../enum/transaction.enum';

export interface ICard {
  number: string;
  holderName: string;
  cvv: string;
  expirationDate: string;
  installments: number;
}

export interface IPaymentProccesInput {
  amount: number;
  currency: string;
  description: string;
  paymentMethod: {
    type: EPaymentType;
    card: ICard;
  };
}

export interface IPaymentProcessSuccessOutput {
  status: string;
  currency: string;
  transactionId: string;
  externalTransactionId: string;
  amount: number;
  paymentProvider: string;
  date: Date;
}

export enum EPaymentFailReason {
  INTEGRATOR = 'integrator',
  UNAUTHORIZED = 'unauthorized',
}

export interface IPaymentProccesFailOutput {
  status: ETransactionStatus;
  failReason: EPaymentFailReason;
  message: ETransactionStatusMessage;
}
