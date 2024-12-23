import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TransactionRepository } from '../../persistence/repository/transaction.repository';
import { TransactionModule } from '../../transaction.module';

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

  describe('/payments', () => {
    it('should be create a payment', async () => {
      const paymentBody = {
        amount: 1500,
        currency: 'BRL',
        description: 'payment',
        paymentMethod: {
          type: 'card',
          card: {
            number: '5544618458800811',
            holderName: 'Radek Muhammed',
            cvv: '153',
            expirationDate: '10/2030',
            installments: 2,
          },
        },
      };

      const expectedResponse = {
        status: 'authorized',
        currency: 'BRL',
        amount: 1500,
        paymentProvider: 'Stripe',
      };

      const response = await request(app.getHttpServer())
        .post('/payments')
        .send(paymentBody)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject(expectedResponse);

      expect(response.body.externalTransactionId).toBeDefined();
    });
  });
});
