import { faker } from '@faker-js/faker/.';
import {
  EIntegrator,
  ETransactionStatus,
  ETransactionStatusMessage,
  EPaymentType,
  EType,
} from '../../enum/transaction.enum';
import { TransactionHistoryModel } from '../../model/transaction-history.model';
import { TransactionModel } from '../../model/transaction.model';
import { TransactionDetailModel } from '../../model/transaction-detail.model';
import { EStatusStripe } from '@src/module/transaction/integration/interface/stripe-api.interface';
import { EStatusBraintree } from '@src/module/transaction/integration/interface/braintree-api.interface';

export const historyResponseMock = new TransactionHistoryModel({
  transactionId: faker.string.uuid(),
  paymentType: EPaymentType.CARD,
  type: EType.PAYMENT,
  status: ETransactionStatus.PROSSEGING,
  statusMessage: ETransactionStatusMessage.PROCESSING,
  processedBy: EIntegrator.NO_INTEGRATOR,
  currency: 'BRL',
  amount: faker.number.int(),
});

export const transactionResponseMock = new TransactionModel({
  id: faker.string.uuid(),
  paymentType: EPaymentType.CARD,
  type: EType.PAYMENT,
  status: ETransactionStatus.PROSSEGING,
  statusMessage: ETransactionStatusMessage.PROCESSING,
  processedBy: EIntegrator.NO_INTEGRATOR,
  currency: 'BRL',
  amount: faker.number.int(),
});

export const detailResponseMock = new TransactionDetailModel({
  transactionId: faker.string.uuid(),
  type: EPaymentType.CARD,
  cardNumber: faker.string.numeric(16),
  holderName: faker.person.fullName(),
  cvv: faker.string.numeric(3),
  expirationDate: '12/2030',
  installments: faker.number.int(),
});

export const stripeApiResponseMock = {
  id: faker.string.uuid(),
  createdAt: new Date(),
  status: EStatusStripe.AUTHORIZED,
  originalAmount: faker.number.int(),
  currentAmount: faker.number.int(),
  currency: 'BRL',
  description: 'Description',
  paymentMethod: EPaymentType.CARD,
  cardId: faker.string.uuid(),
};

export const braintreeApiResponseMock = {
  id: faker.string.uuid(),
  date: new Date(),
  status: EStatusBraintree.PAID,
  originalAmount: faker.number.int(),
  amount: faker.number.int(),
  currency: 'BRL',
  statementDescriptor: 'Statement Description',
  paymentType: EPaymentType.CARD,
  cardId: faker.string.uuid(),
};

export const paymentProcessInput = {
  amount: faker.number.int(),
  currency: 'BRL',
  description: 'Description',
  paymentMethod: {
    type: EPaymentType.CARD,
    card: {
      number: faker.string.numeric(16),
      holderName: faker.person.fullName(),
      cvv: faker.string.numeric(3),
      expirationDate: '12/2030',
      installments: faker.number.int(),
    },
  },
};

export const braintreePaymentInput = {
  amount: faker.number.int(),
  currency: 'BRL',
  statementDescriptor: 'Statement Description',
  paymentType: EPaymentType.CARD,
  card: {
    number: faker.string.numeric(16),
    holderName: faker.person.fullName(),
    cvv: faker.string.numeric(3),
    expirationDate: '12/2030',
    installments: faker.number.int(),
  },
};
