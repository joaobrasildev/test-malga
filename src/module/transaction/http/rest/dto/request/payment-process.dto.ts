import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  @MinLength(16)
  number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  holderName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  @MinLength(3)
  cvv: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'expirationDate must be in the format MM/YYYY',
  })
  expirationDate: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  installments: number;
}

class PaymentMethodDto {
  @ApiProperty()
  @IsEnum(EPaymentType)
  @IsNotEmpty()
  type: EPaymentType;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;
}

export class PaymentRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;
}
