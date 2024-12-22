import { TransactionHistoryRepository } from '@src/module/transaction/persistence/repository/transaction-history.repository';
import { TransactionRepository } from '@src/module/transaction/persistence/repository/transaction.repository';
import { StripeApiProvider } from '@src/module/transaction/integration/provider/stripe-api.provider';
import { BraintreeApiProvider } from '@src/module/transaction/integration/provider/braintree-api.provider';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ERefundFailReason,
  IRefundProccesFailOutput,
  IRefundProccesInput,
  IRefundProcessSuccessOutput,
} from '../interface/refund-process.interface';
import { TransactionHistoryModel } from '../model/transaction-history.model';
import {
  EIntegrator,
  ETransactionStatus,
  ETransactionStatusMessage,
  EType,
} from '../enum/transaction.enum';
import { TransactionModel } from '../model/transaction.model';
import { TransactionDetailRepository } from '../../persistence/repository/transaction-detail.repository';

@Injectable()
export class RefundProcessService {
  private readonly providers: Record<EIntegrator, any>;
  constructor(
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionDetailRepository: TransactionDetailRepository,
    private readonly stripeApiProvider: StripeApiProvider,
    private readonly braintreeApiProvider: BraintreeApiProvider,
  ) {
    this.providers = {
      [EIntegrator.STRIPE]: stripeApiProvider,
      [EIntegrator.BRAINTREE]: braintreeApiProvider,
      [EIntegrator.NO_INTEGRATOR]: null,
    };
  }

  async process(
    params: IRefundProccesInput,
  ): Promise<IRefundProcessSuccessOutput | IRefundProccesFailOutput> {
    const transaction =
      await this.transactionRepository.getTransactionByExternalId(
        params.externalTransactionId,
      );

    if (!transaction) throw new NotFoundException('Transaction not found!');

    if (transaction.status === ETransactionStatus.REFUNDED)
      throw new ConflictException('Transaction already refunded!');

    if (transaction.status !== ETransactionStatus.PROCESSED)
      throw new ConflictException('Refund not permited!');

    const historyModel = new TransactionHistoryModel({
      transactionId: transaction.id,
      paymentType: transaction.paymentType,
      type: EType.REFUND,
      status: ETransactionStatus.REFUNDING,
      statusMessage: ETransactionStatusMessage.REFUNDING,
      processedBy: transaction.processedBy,
      currency: transaction.currency,
      amount: transaction.amount,
    });

    await this.transactionHistoryRepository.saveTransactionHistory(
      historyModel,
    );

    try {
      const refundResponse = await this.providers[
        transaction.processedBy
      ].refundTransaction({
        id: params.externalTransactionId,
        amount: transaction.amount,
      });

      await Promise.all([
        this.transactionHistoryRepository.saveTransactionHistory(
          new TransactionHistoryModel({
            transactionId: transaction.id,
            paymentType: transaction.paymentType,
            type: EType.REFUND,
            status: ETransactionStatus.REFUNDED,
            statusMessage: ETransactionStatusMessage.REFUNDED,
            processedBy: transaction.processedBy,
            currency: transaction.currency,
            amount: transaction.amount,
          }),
        ),
        this.transactionRepository.updateTransaction(
          new TransactionModel({
            ...transaction,
            status: ETransactionStatus.REFUNDED,
            statusMessage: ETransactionStatusMessage.REFUNDED,
            refundTransactionId: refundResponse.id,
          }),
        ),
      ]);

      return {
        status: refundResponse.status,
        currency: refundResponse.currency,
        transactionId: transaction.id,
        refundTransactionId: refundResponse.id,
        amount: refundResponse.currentAmount,
        refundProvider: EIntegrator.STRIPE,
        date: refundResponse.createdAt,
      };
    } catch (providerError) {
      console.log(
        `${transaction.processedBy.toLowerCase()}_PROVIDER_REFUND_ERROR::${providerError}`,
      );
      await this.transactionHistoryRepository.saveTransactionHistory(
        new TransactionHistoryModel({
          transactionId: transaction.id,
          paymentType: transaction.paymentType,
          type: EType.REFUND,
          status: ETransactionStatus.REFUNDING_FAILED,
          statusMessage: ETransactionStatusMessage.REFUNDING_FAILED,
          processedBy: transaction.processedBy,
          currency: transaction.currency,
          amount: transaction.amount,
        }),
      );
      throw new InternalServerErrorException({
        status: ETransactionStatus.REFUNDING_FAILED,
        failReason: ERefundFailReason.INTEGRATOR,
        message: ETransactionStatusMessage.REFUNDING_FAILED,
      });
    }
  }
}
