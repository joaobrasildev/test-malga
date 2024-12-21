import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { PaymentProcessController } from './http/rest/controller/payment-process.controller';
import { PaymentProcessService } from './core/service/payment-proccess.service';
import { StripeApiProvider } from './integration/provider/stripe-api.provider';
import { BraintreeApiProvider } from './integration/provider/braintree-api.provider';

@Module({
  imports: [PersistenceModule.forRoot()],
  providers: [PaymentProcessService, StripeApiProvider, BraintreeApiProvider],
  controllers: [PaymentProcessController],
  exports: [StripeApiProvider, BraintreeApiProvider],
})
export class TransactionModule {}
