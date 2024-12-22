import { TransactionDetailRepository } from '@src/module/transaction/persistence/repository/transaction-detail.repository';
import { TransactionHistoryRepository } from '@src/module/transaction/persistence/repository/transaction-history.repository';
import { TransactionRepository } from '@src/module/transaction/persistence/repository/transaction.repository';
import {
  EPaymentFailReason,
  IPaymentProccesFailOutput,
  IPaymentProccesInput,
  IPaymentProcessSuccessOutput,
} from '../interface/payment-process.interface';
import { randomUUID } from 'crypto';
import {
  EIntegrator,
  ETransactionStatus,
  ETransactionStatusMessage,
  EPaymentType,
  EType,
} from '../enum/transaction.enum';
import { StripeApiProvider } from '@src/module/transaction/integration/provider/stripe-api.provider';
import { BraintreeApiProvider } from '@src/module/transaction/integration/provider/braintree-api.provider';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TransactionHistoryModel } from '../model/transaction-history.model';
import { TransactionModel } from '../model/transaction.model';
import { TransactionDetailModel } from '../model/transaction-detail.model';

@Injectable()
export class PaymentProcessService {
  constructor(
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionDetailRepository: TransactionDetailRepository,
    private readonly stripeApiProvider: StripeApiProvider,
    private readonly braintreeApiProvider: BraintreeApiProvider,
  ) {}

  async process(
    params: IPaymentProccesInput,
  ): Promise<IPaymentProcessSuccessOutput | IPaymentProccesFailOutput> {
    const transactionId = randomUUID();
    const historyModel = new TransactionHistoryModel({
      transactionId: transactionId,
      paymentType: params.paymentMethod.type,
      type: EType.PAYMENT,
      status: ETransactionStatus.PROCESSING,
      statusMessage: ETransactionStatusMessage.PROCESSING,
      processedBy: EIntegrator.NO_INTEGRATOR,
      currency: params.currency,
      amount: params.amount,
    });

    const transactionModel = new TransactionModel({
      id: transactionId,
      paymentType: params.paymentMethod.type,
      type: EType.PAYMENT,
      status: ETransactionStatus.PROCESSING,
      statusMessage: ETransactionStatusMessage.PROCESSING,
      processedBy: EIntegrator.NO_INTEGRATOR,
      currency: params.currency,
      amount: params.amount,
    });

    const detailModel = new TransactionDetailModel({
      transactionId: transactionId,
      type: EPaymentType.CARD,
      cardNumber: params.paymentMethod.card.number,
      holderName: params.paymentMethod.card.holderName,
      cvv: params.paymentMethod.card.cvv,
      expirationDate: params.paymentMethod.card.expirationDate,
      installments: params.paymentMethod.card.installments,
    });

    await Promise.all([
      this.transactionHistoryRepository.saveTransactionHistory(historyModel),
      this.transactionRepository.saveTransaction(transactionModel),
      this.transactionDetailRepository.saveTransactionDetail(detailModel),
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

      await Promise.all([
        this.transactionHistoryRepository.saveTransactionHistory(
          new TransactionHistoryModel({
            transactionId: transactionId,
            paymentType: params.paymentMethod.type,
            type: EType.PAYMENT,
            status: ETransactionStatus.PROCESSED,
            statusMessage: ETransactionStatusMessage.PROCESSED,
            processedBy: EIntegrator.STRIPE,
            currency: params.currency,
            amount: params.amount,
          }),
        ),
        this.transactionRepository.updateTransaction(
          new TransactionModel({
            id: transactionId,
            externalTransactionId: transactionResponse.id,
            paymentType: params.paymentMethod.type,
            type: EType.PAYMENT,
            status: ETransactionStatus.PROCESSED,
            statusMessage: ETransactionStatusMessage.PROCESSED,
            processedBy: EIntegrator.STRIPE,
            currency: params.currency,
            amount: params.amount,
          }),
        ),
      ]);

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
      console.log(`STRIPE_PROVIDER_PAYMENT_ERROR::${stripeError}`);
      await this.transactionHistoryRepository.saveTransactionHistory(
        new TransactionHistoryModel({
          transactionId: transactionId,
          paymentType: params.paymentMethod.type,
          type: EType.PAYMENT,
          status: ETransactionStatus.PROCESSING_FAILED,
          statusMessage: ETransactionStatusMessage.PROCESSING_FAILED_UNAVALABLE,
          processedBy: EIntegrator.STRIPE,
          currency: params.currency,
          amount: params.amount,
        }),
      );

      try {
        transactionResponse =
          await this.braintreeApiProvider.paymentTransaction({
            amount: params.amount,
            currency: params.currency,
            statementDescriptor: params.description,
            paymentType: params.paymentMethod.type,
            card: params.paymentMethod.card,
          });

        await this.transactionHistoryRepository.saveTransactionHistory(
          new TransactionHistoryModel({
            transactionId: transactionId,
            paymentType: params.paymentMethod.type,
            type: EType.PAYMENT,
            status: ETransactionStatus.PROCESSED,
            statusMessage: ETransactionStatusMessage.PROCESSED,
            processedBy: EIntegrator.BRAINTREE,
            currency: params.currency,
            amount: params.amount,
          }),
        );

        await this.transactionRepository.updateTransaction(
          new TransactionModel({
            id: transactionId,
            externalTransactionId: transactionResponse.id,
            paymentType: params.paymentMethod.type,
            type: EType.PAYMENT,
            status: ETransactionStatus.PROCESSED,
            statusMessage: ETransactionStatusMessage.PROCESSED,
            processedBy: EIntegrator.BRAINTREE,
            currency: params.currency,
            amount: params.amount,
          }),
        );

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
        console.log(`BRAINTREE_PROVIDER_PAYMENT_ERROR::${braintreeError}`);
        await this.transactionHistoryRepository.saveTransactionHistory(
          new TransactionHistoryModel({
            transactionId: transactionId,
            paymentType: params.paymentMethod.type,
            type: EType.PAYMENT,
            status: ETransactionStatus.PROCESSING_FAILED,
            statusMessage:
              ETransactionStatusMessage.PROCESSING_FAILED_UNAVALABLE,
            processedBy: EIntegrator.BRAINTREE,
            currency: params.currency,
            amount: params.amount,
          }),
        );

        throw new InternalServerErrorException({
          status: ETransactionStatus.PROCESSING_FAILED,
          failReason: EPaymentFailReason.INTEGRATOR,
          message: ETransactionStatusMessage.PROCESSING_FAILED_UNAVALABLE,
        });
      }
    }
  }
}
