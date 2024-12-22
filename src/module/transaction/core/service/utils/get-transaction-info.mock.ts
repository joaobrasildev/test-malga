import { faker } from '@faker-js/faker/.';
import { TransactionHistoryModel } from '../../model/transaction-history.model';
import {
  EIntegrator,
  EPaymentType,
  ETransactionStatus,
  ETransactionStatusMessage,
  EType,
} from '../../enum/transaction.enum';
import { TransactionModel } from '../../model/transaction.model';
import { TransactionDetailModel } from '../../model/transaction-detail.model';

export const historyResponseMock = new TransactionHistoryModel({
  transactionId: faker.string.uuid(),
  paymentType: EPaymentType.CARD,
  type: EType.PAYMENT,
  status: ETransactionStatus.PROCESSING,
  statusMessage: ETransactionStatusMessage.PROCESSING,
  processedBy: EIntegrator.NO_INTEGRATOR,
  currency: 'BRL',
  amount: faker.number.int(),
});

export const transactionResponseMock = new TransactionModel({
  id: faker.string.uuid(),
  paymentType: EPaymentType.CARD,
  type: EType.PAYMENT,
  status: ETransactionStatus.PROCESSING,
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
