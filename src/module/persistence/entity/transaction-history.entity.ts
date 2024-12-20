import {
  EIntegrator,
  EPaymentStatus,
  EPaymentType,
  EType,
} from '@src/module/core/enum/transaction.enum';
import { DefaultEntity } from '@src/shared/persistence/typeorm/default.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity({ name: 'transactionHistory' })
export class TransactionHistory extends DefaultEntity<TransactionHistory> {
  @Column({ nullable: false, type: 'uuid' })
  transactionId: string;

  @Column({
    nullable: false,
    type: 'varchar',
    enum: EPaymentType,
    enumName: 'paymentTypeHistory',
  })
  paymentType: EPaymentType;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EType,
    enumName: 'typeHistory',
  })
  type: EType;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EPaymentStatus,
    enumName: 'paymentStatusHistory',
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
    enumName: 'integratorHistory',
  })
  processedBy: EIntegrator;

  @Column({ nullable: false, type: 'varchar' })
  currency: string;

  @Column({ nullable: false, type: 'int' })
  amount: number;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionHistory)
  @JoinColumn()
  transaction: Transaction;
}
