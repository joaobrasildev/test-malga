import { DefaultEntity } from '@src/shared/persistence/typeorm/default.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';
import { EType } from '@src/module/core/enum/transaction.enum';

@Entity({ name: 'transactionDetail' })
export class TransactionDetails extends DefaultEntity<TransactionDetails> {
  @Column({ nullable: false, type: 'uuid' })
  transactionId: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EType,
    enumName: 'typeDetail',
  })
  type: EType;

  @Column({ nullable: true, type: 'varchar' })
  cardNumber: string;

  @Column({ nullable: true, type: 'varchar' })
  holderName: string;

  @Column({ nullable: true, type: 'varchar' })
  cvv: string;

  @Column({ nullable: true, type: 'varchar' })
  expirationDate: string;

  @Column({ nullable: true, type: 'int' })
  installments: number;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionDetails)
  @JoinColumn()
  transaction: Transaction;
}
