import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  currency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  externalTransactionId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  paymentProvider: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  @Expose()
  date: Date;
}
