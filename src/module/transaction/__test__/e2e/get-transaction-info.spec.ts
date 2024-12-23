import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TransactionRepository } from '../../persistence/repository/transaction.repository';
import { TransactionModule } from '../../transaction.module';
import { faker } from '@faker-js/faker/.';
import {
  EIntegrator,
  EPaymentType,
  ETransactionStatus,
  ETransactionStatusMessage,
  EType,
} from '../../core/enum/transaction.enum';
import { TransactionModel } from '../../core/model/transaction.model';
import { TransactionHistoryRepository } from '../../persistence/repository/transaction-history.repository';
import { TransactionDetailRepository } from '../../persistence/repository/transaction-detail.repository';
import { TransactionHistoryModel } from '../../core/model/transaction-history.model';
import { TransactionDetailModel } from '../../core/model/transaction-detail.model';

describe('Payment Process - Test (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let transactionRepository: TransactionRepository;
  let transactionHistoryRepository: TransactionHistoryRepository;
  let transactionDetailRepository: TransactionDetailRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TransactionModule],
    }).compile();

    app = module.createNestApplication();
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    transactionHistoryRepository = module.get<TransactionHistoryRepository>(
      TransactionHistoryRepository,
    );
    transactionDetailRepository = module.get<TransactionDetailRepository>(
      TransactionDetailRepository,
    );
    await app.init();
  });

  beforeEach(async () => {
    await transactionDetailRepository.deleteAll();
    await transactionHistoryRepository.deleteAll();
    await transactionRepository.deleteAll();
  });
  afterAll(async () => await module.close());

  describe('/payments/:externalId', () => {
    it('should be get all informations of a transaction', async () => {
      const externalTransactionId = faker.string.uuid();
      const transactionId = faker.string.uuid();

      const transactionModel = new TransactionModel({
        id: transactionId,
        paymentType: EPaymentType.CARD,
        type: EType.PAYMENT,
        externalTransactionId,
        status: ETransactionStatus.PROCESSED,
        statusMessage: ETransactionStatusMessage.PROCESSED,
        processedBy: EIntegrator.STRIPE,
        currency: 'BRL',
        amount: 200,
      });

      const transactionHistoryModel = new TransactionHistoryModel({
        id: faker.string.uuid(),
        paymentType: EPaymentType.CARD,
        type: EType.PAYMENT,
        transactionId,
        status: ETransactionStatus.PROCESSED,
        statusMessage: ETransactionStatusMessage.PROCESSED,
        processedBy: EIntegrator.STRIPE,
        currency: 'BRL',
        amount: 200,
      });

      const transactionDetailModel = new TransactionDetailModel({
        transactionId: transactionId,
        type: EPaymentType.CARD,
        cardNumber: faker.string.numeric(16),
        holderName: faker.person.fullName(),
        cvv: faker.string.numeric(3),
        expirationDate: '12/2031',
        installments: faker.number.int(2),
      });

      await Promise.all([
        transactionRepository.saveTransaction(transactionModel),
        transactionDetailRepository.saveTransactionDetail(
          transactionDetailModel,
        ),
        transactionHistoryRepository.saveTransactionHistory(
          transactionHistoryModel,
        ),
      ]);

      const response = await request(app.getHttpServer())
        .get(`/payments/${externalTransactionId}`)
        .expect(HttpStatus.OK);

      expect(response.body['transaction']).toHaveProperty('id');
      expect(response.body['transaction']).toHaveProperty('amount', 200);
      expect(response.body['transaction']).toHaveProperty('currency', 'BRL');
      expect(response.body['paymentDetails']).toHaveProperty(
        'expirationDate',
        '12/2031',
      );
      expect(response.body['paymentDetails']).toHaveProperty(
        'type',
        EPaymentType.CARD,
      );
      expect(response.body['paymentDetails']).toHaveProperty(
        'transactionId',
        transactionId,
      );
      expect(response.body['transactionHistory'][0]).toHaveProperty(
        'transactionId',
        transactionId,
      );
      expect(response.body['transactionHistory'][0]).toHaveProperty(
        'amount',
        200,
      );
      expect(response.body['transactionHistory'][0]).toHaveProperty(
        'currency',
        'BRL',
      );
    });
  });
});
