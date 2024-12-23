import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionDetailRepository } from '../../persistence/repository/transaction-detail.repository';
import { TransactionHistoryRepository } from '../../persistence/repository/transaction-history.repository';
import { TransactionRepository } from '../../persistence/repository/transaction.repository';
import { IGetInfoResponse } from '../interface/get-transaction-info.interface';

@Injectable()
export class GetTransactionInfoService {
  constructor(
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionDetailRepository: TransactionDetailRepository,
  ) {}
  async getInfo(externalTransactionId: string): Promise<IGetInfoResponse> {
    const transaction =
      await this.transactionRepository.getTransactionByExternalId(
        externalTransactionId,
      );

    if (!transaction) throw new NotFoundException('Transaction not found!');

    const [detail, history] = await Promise.all([
      this.transactionDetailRepository.getDetailByTransactionId(transaction.id),
      this.transactionHistoryRepository.getHistoryByTransactionId(
        transaction.id,
      ),
    ]);

    return {
      transaction,
      paymentDetails: detail,
      transactionHistory: history,
    };
  }
}
