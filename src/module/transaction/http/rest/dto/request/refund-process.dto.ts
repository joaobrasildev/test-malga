import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RefundRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}
