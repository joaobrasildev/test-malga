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

describe('Payment Process - Test (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let transactionRepository: TransactionRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TransactionModule],
    }).compile();

    app = module.createNestApplication();
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    await app.init();
  });

  beforeEach(async () => {
    await transactionRepository.deleteAll();
  });
  afterAll(async () => await module.close());

  describe('/refunds', () => {
    it('should be refund a payment', async () => {
      const externalTransactionId = faker.string.uuid();
      const transactionEntity = new TransactionModel({
        id: faker.string.uuid(),
        paymentType: EPaymentType.CARD,
        type: EType.PAYMENT,
        externalTransactionId,
        status: ETransactionStatus.PROCESSED,
        statusMessage: ETransactionStatusMessage.PROCESSED,
        processedBy: EIntegrator.STRIPE,
        currency: 'BRL',
        amount: 200,
      });

      await transactionRepository.saveTransaction(transactionEntity);

      const expectedResponse = {
        status: 'refunded',
        currency: 'BRL',
        amount: 200,
      };

      const response = await request(app.getHttpServer())
        .post('/refunds')
        .send({ transactionId: externalTransactionId })
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject(expectedResponse);

      expect(response.body.refundTransactionId).toBeDefined();
    });
  });
});
