import {
  EIntegrator,
  EPaymentStatus,
  EPaymentType,
  EType,
} from '@src/module/core/enum/transaction.enum';
import { DefaultEntity } from '@src/shared/persistence/typeorm/entity/default.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TransactionHistoryEntity } from './transaction-history.entity';
import { TransactionDetailEntity } from './transaction-details.entity';

@Entity({ name: 'transaction' })
export class TransactionEntity extends DefaultEntity<TransactionEntity> {
  @Column({ nullable: true, type: 'uuid' })
  externalTransactionId: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EPaymentType,
    enumName: 'paymentTypeTransaction',
  })
  paymentType: EPaymentType;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EType,
    enumName: 'typeTransaction',
  })
  type: EType;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EPaymentStatus,
    enumName: 'paymentStatusTransaction',
  })
  status: EPaymentStatus;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  statusMessage: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EIntegrator,
    enumName: 'integratorTransaction',
  })
  processedBy: EIntegrator;

  @Column({ nullable: false, type: 'varchar' })
  currency: string;

  @Column({ nullable: false, type: 'int' })
  amount: number;

  @ManyToOne(
    () => TransactionHistoryEntity,
    (transactionHistory) => transactionHistory.transaction,
    {
      cascade: true,
    },
  )
  transactionHistory: TransactionHistoryEntity;

  @ManyToOne(
    () => TransactionDetailEntity,
    (transactionDetails) => transactionDetails.transaction,
    {
      cascade: true,
    },
  )
  transactionDetails: TransactionDetailEntity;
}
