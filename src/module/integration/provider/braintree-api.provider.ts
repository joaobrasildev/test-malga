import { Injectable } from '@nestjs/common';
import {
  EStatusBraintree,
  IGetTransactionBraintreeOutput,
  IPaymentBraintreeInput,
  IPaymentBraintreeOutput,
  IRefundBraintreeInput,
  IRefundBraintreeOutput,
} from '../interface/braintree-api.interface';
import { randomUUID } from 'crypto';
import { EPaymentType } from '@src/module/core/enum/transaction.enum';

@Injectable()
export class BraintreeApiProvider {
  public async paymentTransaction(
    params: IPaymentBraintreeInput,
  ): Promise<IPaymentBraintreeOutput> {
    return {
      id: randomUUID(),
      date: new Date(),
      status: EStatusBraintree.PAID,
      originalAmount: params.amount,
      amount: params.amount,
      currency: params.currency,
      statementDescriptor: params.statementDescriptor,
      paymentType: EPaymentType.CARD,
      cardId: randomUUID(),
    };
  }

  public async refundTransaction(
    params: IRefundBraintreeInput,
  ): Promise<IRefundBraintreeOutput> {
    return {
      id: randomUUID(),
      date: new Date(),
      status: EStatusBraintree.PAID,
      originalAmount: params.amount,
      amount: params.amount,
      currency: 'BRL',
      statementDescriptor: 'Statement Description',
      paymentType: EPaymentType.CARD,
      cardId: randomUUID(),
    };
  }

  public async getTransaction(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: string,
  ): Promise<IGetTransactionBraintreeOutput> {
    return {
      id: randomUUID(),
      date: new Date(),
      status: EStatusBraintree.PAID,
      originalAmount: 100,
      amount: 100,
      currency: 'BRL',
      statementDescriptor: 'Statement Description',
      paymentType: EPaymentType.CARD,
      cardId: randomUUID(),
    };
  }
}