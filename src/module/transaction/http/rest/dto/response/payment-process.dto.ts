import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentResponseDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  externalTransactionId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  paymentProvider: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
