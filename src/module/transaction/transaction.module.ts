import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { PaymentProcessController } from './http/rest/controller/payment-process.controller';
import { PaymentProcessService } from './core/service/payment-process.service';
import { StripeApiProvider } from './integration/provider/stripe-api.provider';
import { BraintreeApiProvider } from './integration/provider/braintree-api.provider';
import { RefundProcessService } from './core/service/refund-proccess.service';
import { RefundProcessController } from './http/rest/controller/refund-process.controller';
import { GetTransactionInfoService } from './core/service/get-transaction-info.service';
import { GetTransactionInfoController } from './http/rest/controller/get-transaction-info.controller';

@Module({
  imports: [PersistenceModule.forRoot()],
  providers: [
    PaymentProcessService,
    StripeApiProvider,
    BraintreeApiProvider,
    RefundProcessService,
    GetTransactionInfoService,
  ],
  controllers: [
    PaymentProcessController,
    RefundProcessController,
    GetTransactionInfoController,
  ],
  exports: [StripeApiProvider, BraintreeApiProvider],
})
export class TransactionModule {}
