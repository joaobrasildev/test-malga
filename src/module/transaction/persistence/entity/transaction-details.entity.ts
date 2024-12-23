import { DefaultEntity } from '@src/shared/persistence/typeorm/entity/default.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { EPaymentType } from '@src/module/transaction/core/enum/transaction.enum';

@Entity({ name: 'transactionDetail' })
export class TransactionDetailEntity extends DefaultEntity<TransactionDetailEntity> {
  @Column({ nullable: false, type: 'uuid' })
  transactionId: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EPaymentType,
    enumName: 'typePaymentDetail',
  })
  type: EPaymentType;

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

  @OneToMany(
    () => TransactionEntity,
    (transaction) => transaction.transactionDetails,
  )
  @JoinColumn()
  transaction: TransactionEntity;
}
