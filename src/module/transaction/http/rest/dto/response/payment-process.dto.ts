import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  status: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  currency: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  externalTransactionId: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  paymentProvider: string;

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  date: Date;
}
