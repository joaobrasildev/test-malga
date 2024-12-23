import { TransactionHistoryRepository } from '@src/module/transaction/persistence/repository/transaction-history.repository';
import { GetTransactionInfoService } from '../get-transaction-info.service';
import { TransactionRepository } from '@src/module/transaction/persistence/repository/transaction.repository';
import { TransactionDetailRepository } from '@src/module/transaction/persistence/repository/transaction-detail.repository';
import { Test } from '@nestjs/testing';
import {
  detailResponseMock,
  historyResponseMock,
  transactionResponseMock,
} from '../utils/get-transaction-info.mock';
import { faker } from '@faker-js/faker/.';
import { NotFoundException } from '@nestjs/common';

describe('PaymentProcessService', () => {
  let getTransactionInfoService: GetTransactionInfoService;
  let transactionHistoryRepository: jest.Mocked<TransactionHistoryRepository>;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let transactionDetailRepository: jest.Mocked<TransactionDetailRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetTransactionInfoService,
        {
          provide: TransactionHistoryRepository,
          useValue: {
            getHistoryByTransactionId: jest.fn(),
          },
        },
        {
          provide: TransactionDetailRepository,
          useValue: {
            getDetailByTransactionId: jest.fn(),
          },
        },
        {
          provide: TransactionRepository,
          useValue: {
            getTransactionByExternalId: jest.fn(),
          },
        },
      ],
    }).compile();

    getTransactionInfoService = moduleRef.get<GetTransactionInfoService>(
      GetTransactionInfoService,
    );
    transactionHistoryRepository = moduleRef.get(TransactionHistoryRepository);
    transactionDetailRepository = moduleRef.get(TransactionDetailRepository);
    transactionRepository = moduleRef.get(TransactionRepository);
  });

  it('to be defined', () => {
    expect(getTransactionInfoService).toBeDefined();
    expect(transactionHistoryRepository).toBeDefined();
    expect(transactionDetailRepository).toBeDefined();
    expect(transactionRepository).toBeDefined();
  });

  it('should be return transaction info', async () => {
    const externalTransactionId = faker.string.uuid();
    transactionHistoryRepository.getHistoryByTransactionId.mockResolvedValue([
      historyResponseMock,
    ]);
    transactionDetailRepository.getDetailByTransactionId.mockResolvedValue(
      detailResponseMock,
    );
    transactionRepository.getTransactionByExternalId.mockResolvedValue(
      transactionResponseMock,
    );

    const response = await getTransactionInfoService.getInfo(
      externalTransactionId,
    );

    expect(response).toEqual({
      transaction: transactionResponseMock,
      paymentDetails: detailResponseMock,
      transactionHistory: [historyResponseMock],
    });
    expect(
      transactionHistoryRepository.getHistoryByTransactionId,
    ).toHaveBeenCalledTimes(1);
    expect(
      transactionDetailRepository.getDetailByTransactionId,
    ).toHaveBeenCalledTimes(1);
    expect(
      transactionRepository.getTransactionByExternalId,
    ).toHaveBeenCalledTimes(1);
    expect(
      transactionHistoryRepository.getHistoryByTransactionId,
    ).toHaveBeenCalledWith(transactionResponseMock.id);
    expect(
      transactionDetailRepository.getDetailByTransactionId,
    ).toHaveBeenCalledWith(transactionResponseMock.id);
    expect(
      transactionRepository.getTransactionByExternalId,
    ).toHaveBeenCalledWith(externalTransactionId);
  });

  it('should be return transaction not found error', async () => {
    const externalTransactionId = faker.string.uuid();
    transactionRepository.getTransactionByExternalId.mockResolvedValue(
      undefined,
    );

    await expect(
      getTransactionInfoService.getInfo(externalTransactionId),
    ).rejects.toEqual(new NotFoundException('Transaction not found!'));
    expect(
      transactionHistoryRepository.getHistoryByTransactionId,
    ).toHaveBeenCalledTimes(0);
    expect(
      transactionDetailRepository.getDetailByTransactionId,
    ).toHaveBeenCalledTimes(0);
    expect(
      transactionRepository.getTransactionByExternalId,
    ).toHaveBeenCalledTimes(1);
  });
});
