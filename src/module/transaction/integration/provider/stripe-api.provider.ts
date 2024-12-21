import { Injectable } from '@nestjs/common';
import {
  EStatusStripe,
  IGetTransactionStripeOutput,
  IPaymentStripeInput,
  IPaymentStripeOutput,
  IRefundStripeInput,
  IRefundStripeOutput,
} from '../interface/stripe-api.interface';
import { randomUUID } from 'crypto';
import { EPaymentType } from '@src/module/transaction/core/enum/transaction.enum';

@Injectable()
export class StripeApiProvider {
  public async paymentTransaction(
    params: IPaymentStripeInput,
  ): Promise<IPaymentStripeOutput> {
    return {
      id: randomUUID(),
      createdAt: new Date(),
      status: EStatusStripe.AUTHORIZED,
      originalAmount: params.amount,
      currentAmount: params.amount,
      currency: params.currency,
      description: params.description,
      paymentMethod: EPaymentType.CARD,
      cardId: randomUUID(),
    };
  }

  public async refundTransaction(
    params: IRefundStripeInput,
  ): Promise<IRefundStripeOutput> {
    return {
      id: randomUUID(),
      createdAt: new Date(),
      status: EStatusStripe.REFUNDED,
      originalAmount: params.amount,
      currentAmount: params.amount,
      currency: 'BRL',
      description: 'Description',
      paymentMethod: EPaymentType.CARD,
      cardId: randomUUID(),
    };
  }

  public async getTransaction(
    id: string,
  ): Promise<IGetTransactionStripeOutput> {
    console.log(id);
    return {
      id: randomUUID(),
      createdAt: new Date(),
      status: EStatusStripe.AUTHORIZED,
      originalAmount: 100,
      currentAmount: 100,
      currency: 'BRL',
      description: 'Description',
      paymentMethod: EPaymentType.CARD,
      cardId: randomUUID(),
    };
  }
}
