import { TransactionDetailRepository } from '@src/module/transaction/persistence/repository/transaction-detail.repository';
import { TransactionHistoryRepository } from '@src/module/transaction/persistence/repository/transaction-history.repository';
import { TransactionRepository } from '@src/module/transaction/persistence/repository/transaction.repository';
import {
  EFailReason,
  IPaymentProccesFailOutput,
  IPaymentProccesInput,
  IPaymentProccesSuccessOutput,
} from '../interface/payment-proccess.interface';
import { TransactionHistoryEntity } from '@src/module/transaction/persistence/entity/transaction-history.entity';
import { randomUUID } from 'crypto';
import {
  EIntegrator,
  EPaymentStatus,
  EPaymentStatusMessage,
  EPaymentType,
  EType,
} from '../enum/transaction.enum';
import { TransactionEntity } from '@src/module/transaction/persistence/entity/transaction.entity';
import { TransactionDetailEntity } from '@src/module/transaction/persistence/entity/transaction-details.entity';
import { StripeApiProvider } from '@src/module/transaction/integration/provider/stripe-api.provider';
import { BraintreeApiProvider } from '@src/module/transaction/integration/provider/braintree-api.provider';

export class PaymentProcessService {
  constructor(
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionDetailRepository: TransactionDetailRepository,
    private readonly stripeApiProvider: StripeApiProvider,
    private readonly braintreeApiProvider: BraintreeApiProvider,
  ) {}

  async proccess(
    params: IPaymentProccesInput,
  ): Promise<IPaymentProccesSuccessOutput | IPaymentProccesFailOutput> {
    const transactionId = randomUUID();
    const historyModel = new TransactionHistoryEntity({
      transactionId: transactionId,
      paymentType: params.paymentMethod.type,
      type: EType.PAYMENT,
      status: EPaymentStatus.PROSSEGING,
      statusMessage: EPaymentStatusMessage.PROCESSING,
      processedBy: EIntegrator.NO_INTEGRATOR,
      currency: params.currency,
      amount: params.amount,
    });

    const transactionModel = new TransactionEntity({
      id: transactionId,
      paymentType: params.paymentMethod.type,
      type: EType.PAYMENT,
      status: EPaymentStatus.PROSSEGING,
      statusMessage: EPaymentStatusMessage.PROCESSING,
      processedBy: EIntegrator.NO_INTEGRATOR,
      currency: params.currency,
      amount: params.amount,
    });

    const detailModel = new TransactionDetailEntity({
      transactionId: transactionId,
      type: EPaymentType.CARD,
      cardNumber: params.paymentMethod.card.number,
      holderName: params.paymentMethod.card.holderName,
      cvv: params.paymentMethod.card.cvv,
      expirationDate: params.paymentMethod.card.expirationDate,
      installments: params.paymentMethod.card.installments,
    });

    Promise.all([
      await this.transactionHistoryRepository.save(historyModel),
      await this.transactionRepository.save(transactionModel),
      await this.transactionDetailRepository.save(detailModel),
    ]);

    let transactionResponse;
    try {
      transactionResponse = await this.stripeApiProvider.paymentTransaction({
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        paymentMethod: {
          type: params.paymentMethod.type,
          card: params.paymentMethod.card,
        },
      });

      // await this.transactionHistoryRepository.save({
      //   ...historyModel,
      //   status: EPaymentStatus.PROCESSED,
      //   statusMessage: EPaymentStatusMessage.PROCESSED,
      //   processedBy: EIntegrator.STRIPE,
      // });

      return {
        status: transactionResponse.status,
        currency: transactionResponse.currency,
        transactionId,
        externalTransactionId: transactionResponse.id,
        amount: transactionResponse.currentAmount,
        paymentProvider: EIntegrator.STRIPE,
        date: transactionResponse.createdAt,
      };
    } catch (stripeError) {
      console.log(`STRIPE_PROVIDER_ERROR::${stripeError}`);
      // await this.transactionHistoryRepository.save({
      //   ...historyModel,
      //   status: EPaymentStatus.PROCESSING_FAILED,
      //   statusMessage: EPaymentStatusMessage.PROCESSING_FAILED_UNAVALABLE,
      //   processedBy: EIntegrator.STRIPE,
      // });

      try {
        transactionResponse =
          await this.braintreeApiProvider.paymentTransaction({
            amount: params.amount,
            currency: params.currency,
            statementDescriptor: params.description,
            paymentType: params.paymentMethod.type,
            card: params.paymentMethod.card,
          });

        //await this.transactionHistoryRepository.save({
        //   ...historyModel,
        //   status: EPaymentStatus.PROCESSED,
        //   statusMessage: EPaymentStatusMessage.PROCESSED,
        //   processedBy: EIntegrator.BRAINTREE,
        // });

        return {
          status: transactionResponse.status,
          currency: transactionResponse.currency,
          transactionId,
          externalTransactionId: transactionResponse.id,
          amount: transactionResponse.amount,
          paymentProvider: EIntegrator.STRIPE,
          date: transactionResponse.date,
        };
      } catch (braintreeError) {
        console.log(`BRAINTREE_PROVIDER_ERROR::${braintreeError}`);
        // await this.transactionHistoryRepository.save({
        //   ...historyModel,
        //   status: EPaymentStatus.PROCESSING_FAILED,
        //   statusMessage: EPaymentStatusMessage.PROCESSING_FAILED_UNAVALABLE,
        //   processedBy: EIntegrator.BRAINTREE,
        // });

        return {
          status: EPaymentStatus.PROCESSING_FAILED,
          failReason: EFailReason.INTEGRATOR,
          message: EPaymentStatusMessage.PROCESSING_FAILED_UNAVALABLE,
        };
      }
    }
  }
}
