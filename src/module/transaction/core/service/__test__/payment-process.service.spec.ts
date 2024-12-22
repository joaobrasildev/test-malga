import { TransactionHistoryRepository } from '@src/module/transaction/persistence/repository/transaction-history.repository';
import { PaymentProcessService } from '../payment-proccess.service';
import { TransactionRepository } from '@src/module/transaction/persistence/repository/transaction.repository';
import { TransactionDetailRepository } from '@src/module/transaction/persistence/repository/transaction-detail.repository';
import { StripeApiProvider } from '@src/module/transaction/integration/provider/stripe-api.provider';
import { BraintreeApiProvider } from '@src/module/transaction/integration/provider/braintree-api.provider';
import { Test } from '@nestjs/testing';
import {
  braintreeApiResponseMock,
  detailResponseMock,
  historyResponseMock,
  stripeApiResponseMock,
  transactionResponseMock,
  paymentProcessInput,
} from './payment-process.mock';
import {
  braintreePaymentInputBuilder,
  stripePaymentInputBuilder,
} from './payment-process.builder';

describe('PaymentProcessService', () => {
  let paymentProcessService: PaymentProcessService;
  let transactionHistoryRepository: jest.Mocked<TransactionHistoryRepository>;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let transactionDetailRepository: jest.Mocked<TransactionDetailRepository>;
  let stripeApiProvider: jest.Mocked<StripeApiProvider>;
  let braintreeApiProvider: jest.Mocked<BraintreeApiProvider>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentProcessService,
        {
          provide: TransactionHistoryRepository,
          useValue: {
            saveTransactionHistory: jest.fn(),
          },
        },
        {
          provide: TransactionDetailRepository,
          useValue: {
            saveTransactionDetail: jest.fn(),
          },
        },
        {
          provide: TransactionRepository,
          useValue: {
            saveTransaction: jest.fn(),
            updateTransaction: jest.fn(),
          },
        },
        {
          provide: StripeApiProvider,
          useValue: {
            paymentTransaction: jest.fn(),
          },
        },
        {
          provide: BraintreeApiProvider,
          useValue: {
            paymentTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    paymentProcessService = moduleRef.get<PaymentProcessService>(
      PaymentProcessService,
    );
    transactionHistoryRepository = moduleRef.get(TransactionHistoryRepository);
    transactionDetailRepository = moduleRef.get(TransactionDetailRepository);
    transactionRepository = moduleRef.get(TransactionRepository);
    stripeApiProvider = moduleRef.get(StripeApiProvider);
    braintreeApiProvider = moduleRef.get(BraintreeApiProvider);
  });

  it('to be defined', () => {
    expect(paymentProcessService).toBeDefined();
    expect(transactionHistoryRepository).toBeDefined();
    expect(transactionDetailRepository).toBeDefined();
    expect(transactionRepository).toBeDefined();
    expect(stripeApiProvider).toBeDefined();
    expect(braintreeApiProvider).toBeDefined();
  });

  it('should be transact on stripe', async () => {
    transactionHistoryRepository.saveTransactionHistory.mockResolvedValue(
      historyResponseMock,
    );
    transactionDetailRepository.saveTransactionDetail.mockResolvedValue(
      detailResponseMock,
    );
    transactionRepository.saveTransaction.mockResolvedValue(
      transactionResponseMock,
    );
    transactionRepository.updateTransaction.mockResolvedValue(
      transactionResponseMock,
    );

    stripeApiProvider.paymentTransaction.mockResolvedValue(
      stripeApiResponseMock,
    );

    await paymentProcessService.proccess(paymentProcessInput);
    expect(
      transactionHistoryRepository.saveTransactionHistory,
    ).toHaveBeenCalledTimes(2);
    expect(braintreeApiProvider.paymentTransaction).toHaveBeenCalledTimes(0);
    expect(stripeApiProvider.paymentTransaction).toHaveBeenCalledWith(
      stripePaymentInputBuilder(paymentProcessInput),
    );
  });

  it('should be transact on braintree', async () => {
    transactionHistoryRepository.saveTransactionHistory.mockResolvedValue(
      historyResponseMock,
    );
    transactionDetailRepository.saveTransactionDetail.mockResolvedValue(
      detailResponseMock,
    );
    transactionRepository.saveTransaction.mockResolvedValue(
      transactionResponseMock,
    );
    transactionRepository.updateTransaction.mockResolvedValue(
      transactionResponseMock,
    );

    braintreeApiProvider.paymentTransaction.mockResolvedValue(
      braintreeApiResponseMock,
    );

    await paymentProcessService.proccess(paymentProcessInput);
    expect(
      transactionHistoryRepository.saveTransactionHistory,
    ).toHaveBeenCalledTimes(4);
    expect(stripeApiProvider.paymentTransaction).toHaveBeenCalledTimes(1);
    expect(braintreeApiProvider.paymentTransaction).toHaveBeenCalledTimes(1);
    expect(braintreeApiProvider.paymentTransaction).toHaveBeenCalledWith(
      braintreePaymentInputBuilder(paymentProcessInput),
    );
  });
  it('Should not be transacted', async () => {
    transactionHistoryRepository.saveTransactionHistory.mockResolvedValue(
      historyResponseMock,
    );
    transactionDetailRepository.saveTransactionDetail.mockResolvedValue(
      detailResponseMock,
    );
    transactionRepository.saveTransaction.mockResolvedValue(
      transactionResponseMock,
    );

    await paymentProcessService.proccess(paymentProcessInput);

    expect(
      transactionHistoryRepository.saveTransactionHistory,
    ).toHaveBeenCalledTimes(5);
    expect(stripeApiProvider.paymentTransaction).toHaveBeenCalledTimes(1);
    expect(braintreeApiProvider.paymentTransaction).toHaveBeenCalledTimes(1);
    expect(braintreeApiProvider.paymentTransaction).toHaveBeenCalledWith(
      braintreePaymentInputBuilder(paymentProcessInput),
    );
    expect(stripeApiProvider.paymentTransaction).toHaveBeenCalledWith(
      stripePaymentInputBuilder(paymentProcessInput),
    );
  });
});
