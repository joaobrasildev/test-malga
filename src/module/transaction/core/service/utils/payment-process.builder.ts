import { IPaymentStripeInput } from '@src/module/transaction/integration/interface/stripe-api.interface';
import { IPaymentProccesInput } from '../../interface/payment-process.interface';
import { IPaymentBraintreeInput } from '@src/module/transaction/integration/interface/braintree-api.interface';

export function stripePaymentInputBuilder(
  params: IPaymentProccesInput,
): IPaymentStripeInput {
  return {
    amount: params.amount,
    currency: params.currency,
    description: params.description,
    paymentMethod: {
      type: params.paymentMethod.type,
      card: params.paymentMethod.card,
    },
  };
}

export function braintreePaymentInputBuilder(
  params: IPaymentProccesInput,
): IPaymentBraintreeInput {
  return {
    amount: params.amount,
    currency: params.currency,
    statementDescriptor: params.description,
    paymentType: params.paymentMethod.type,
    card: params.paymentMethod.card,
  };
}
