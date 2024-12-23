import { TransactionDetailModel } from '../model/transaction-detail.model';
import { TransactionHistoryModel } from '../model/transaction-history.model';
import { TransactionModel } from '../model/transaction.model';

export interface IGetInfoResponse {
  transaction: TransactionModel | undefined;
  paymentDetails: TransactionDetailModel | undefined;
  transactionHistory: TransactionHistoryModel[] | undefined;
}
