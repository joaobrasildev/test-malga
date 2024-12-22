import { TransactionHistoryRepository } from '@src/module/transaction/persistence/repository/transaction-history.repository';
import { RefundProcessService } from '../refund-proccess.service';
import { TransactionRepository } from '@src/module/transaction/persistence/repository/transaction.repository';
import { StripeApiProvider } from '@src/module/transaction/integration/provider/stripe-api.provider';
import { BraintreeApiProvider } from '@src/module/transaction/integration/provider/braintree-api.provider';
import { Test } from '@nestjs/testing';
import {
  braintreeApiResponseMock,
  historyResponseMock,
  stripeApiResponseMock,
  transactionResponseMock,
} from '../utils/payment-process.mock';
import { faker } from '@faker-js/faker/.';
import {
  EIntegrator,
  ETransactionStatus,
  ETransactionStatusMessage,
} from '../../enum/transaction.enum';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ERefundFailReason } from '../../interface/refund-process.interface';

describe('PaymentProcessService', () => {
  let refundProcessService: RefundProcessService;
  let transactionHistoryRepository: jest.Mocked<TransactionHistoryRepository>;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let stripeApiProvider: jest.Mocked<StripeApiProvider>;
  let braintreeApiProvider: jest.Mocked<BraintreeApiProvider>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RefundProcessService,
        {
          provide: TransactionHistoryRepository,
          useValue: {
            saveTransactionHistory: jest.fn(),
          },
        },
        {
          provide: TransactionRepository,
          useValue: {
            updateTransaction: jest.fn(),
            getTransactionByExternalId: jest.fn(),
          },
        },
        {
          provide: StripeApiProvider,
          useValue: {
            refundTransaction: jest.fn(),
          },
        },
        {
          provide: BraintreeApiProvider,
          useValue: {
            refundTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    refundProcessService =
      moduleRef.get<RefundProcessService>(RefundProcessService);
    transactionHistoryRepository = moduleRef.get(TransactionHistoryRepository);
    transactionRepository = moduleRef.get(TransactionRepository);
    stripeApiProvider = moduleRef.get(StripeApiProvider);
    braintreeApiProvider = moduleRef.get(BraintreeApiProvider);
  });

  it('to be defined', () => {
    expect(refundProcessService).toBeDefined();
    expect(transactionHistoryRepository).toBeDefined();
    expect(transactionRepository).toBeDefined();
    expect(stripeApiProvider).toBeDefined();
    expect(braintreeApiProvider).toBeDefined();
  });

  it('should be refund by Stripe', async () => {
    const externalTransactionId = faker.string.uuid();

    transactionHistoryRepository.saveTransactionHistory.mockResolvedValue(
      historyResponseMock,
    );
    transactionRepository.updateTransaction.mockResolvedValue(
      transactionResponseMock,
    );

    transactionRepository.getTransactionByExternalId.mockResolvedValue({
      ...transactionResponseMock,
      externalTransactionId,
      processedBy: EIntegrator.STRIPE,
      status: ETransactionStatus.PROCESSED,
    });

    stripeApiProvider.refundTransaction.mockResolvedValue(
      stripeApiResponseMock,
    );

    await refundProcessService.process({
      externalTransactionId,
    });

    expect(
      transactionHistoryRepository.saveTransactionHistory,
    ).toHaveBeenCalledTimes(2);
    expect(braintreeApiProvider.refundTransaction).toHaveBeenCalledTimes(0);
    expect(stripeApiProvider.refundTransaction).toHaveBeenCalledTimes(1);
    expect(stripeApiProvider.refundTransaction).toHaveBeenCalledWith({
      id: externalTransactionId,
      amount: transactionResponseMock.amount,
    });
  });

  it('should be refund by Braintree', async () => {
    const externalTransactionId = faker.string.uuid();

    transactionHistoryRepository.saveTransactionHistory.mockResolvedValue(
      historyResponseMock,
    );
    transactionRepository.updateTransaction.mockResolvedValue(
      transactionResponseMock,
    );

    transactionRepository.getTransactionByExternalId.mockResolvedValue({
      ...transactionResponseMock,
      externalTransactionId,
      processedBy: EIntegrator.BRAINTREE,
      status: ETransactionStatus.PROCESSED,
    });

    stripeApiProvider.refundTransaction.mockResolvedValue(
      stripeApiResponseMock,
    );

    braintreeApiProvider.refundTransaction.mockResolvedValue(
      braintreeApiResponseMock,
    );

    await refundProcessService.process({
      externalTransactionId,
    });

    expect(
      transactionHistoryRepository.saveTransactionHistory,
    ).toHaveBeenCalledTimes(2);
    expect(braintreeApiProvider.refundTransaction).toHaveBeenCalledTimes(1);
    expect(stripeApiProvider.refundTransaction).toHaveBeenCalledTimes(0);
    expect(braintreeApiProvider.refundTransaction).toHaveBeenCalledWith({
      id: externalTransactionId,
      amount: transactionResponseMock.amount,
    });
  });

  it('should be return transaction not found error', async () => {
    const externalTransactionId = faker.string.uuid();

    transactionRepository.getTransactionByExternalId.mockResolvedValue(
      undefined,
    );

    await expect(
      refundProcessService.process({
        externalTransactionId,
      }),
    ).rejects.toEqual(new NotFoundException('Transaction not found!'));

    expect(
      transactionHistoryRepository.saveTransactionHistory,
    ).toHaveBeenCalledTimes(0);
    expect(braintreeApiProvider.refundTransaction).toHaveBeenCalledTimes(0);
    expect(stripeApiProvider.refundTransaction).toHaveBeenCalledTimes(0);
  });

  it('should be return transaction already refunded error', async () => {
    const externalTransactionId = faker.string.uuid();
    transactionRepository.getTransactionByExternalId.mockResolvedValue({
      ...transactionResponseMock,
      externalTransactionId,
      processedBy: EIntegrator.BRAINTREE,
      status: ETransactionStatus.REFUNDED,
    });

    await expect(
      refundProcessService.process({
        externalTransactionId,
      }),
    ).rejects.toEqual(new ConflictException('Transaction already refunded!'));

    expect(
      transactionHistoryRepository.saveTransactionHistory,
    ).toHaveBeenCalledTimes(0);
    expect(braintreeApiProvider.refundTransaction).toHaveBeenCalledTimes(0);
    expect(stripeApiProvider.refundTransaction).toHaveBeenCalledTimes(0);
  });

  it('should be return refund not permited error', async () => {
    const externalTransactionId = faker.string.uuid();
    transactionRepository.getTransactionByExternalId.mockResolvedValue({
      ...transactionResponseMock,
      externalTransactionId,
      processedBy: EIntegrator.BRAINTREE,
      status: ETransactionStatus.PROCESSING,
    });

    await expect(
      refundProcessService.process({
        externalTransactionId,
      }),
    ).rejects.toEqual(new ConflictException('Refund not permited!'));

    expect(
      transactionHistoryRepository.saveTransactionHistory,
    ).toHaveBeenCalledTimes(0);
    expect(braintreeApiProvider.refundTransaction).toHaveBeenCalledTimes(0);
    expect(stripeApiProvider.refundTransaction).toHaveBeenCalledTimes(0);
  });

  it('should not be refund', async () => {
    const externalTransactionId = faker.string.uuid();

    transactionHistoryRepository.saveTransactionHistory.mockResolvedValue(
      historyResponseMock,
    );
    transactionRepository.updateTransaction.mockResolvedValue(
      transactionResponseMock,
    );

    transactionRepository.getTransactionByExternalId.mockResolvedValue({
      ...transactionResponseMock,
      externalTransactionId,
      processedBy: EIntegrator.BRAINTREE,
      status: ETransactionStatus.PROCESSED,
    });

    await expect(
      refundProcessService.process({
        externalTransactionId,
      }),
    ).rejects.toEqual(
      new InternalServerErrorException({
        status: ETransactionStatus.REFUNDING_FAILED,
        failReason: ERefundFailReason.INTEGRATOR,
        message: ETransactionStatusMessage.REFUNDING_FAILED,
      }),
    );
  });
});
