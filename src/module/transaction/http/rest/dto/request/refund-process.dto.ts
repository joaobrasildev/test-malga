import { IsNotEmpty, IsUUID } from 'class-validator';

export class RefundRequestDto {
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}
