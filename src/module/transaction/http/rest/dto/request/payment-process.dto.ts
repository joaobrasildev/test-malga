import { EPaymentType } from '@src/module/transaction/core/enum/transaction.enum';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CardDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  @MinLength(16)
  number: string;

  @IsString()
  @IsNotEmpty()
  holderName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  @MinLength(3)
  cvv: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'expirationDate must be in the format MM/YYYY',
  })
  expirationDate: string;

  @IsNumber()
  @IsNotEmpty()
  installments: number;
}

class PaymentMethodDto {
  @IsEnum(EPaymentType)
  @IsNotEmpty()
  type: EPaymentType;

  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;
}

export class PaymentRequestDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;
}
