import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentProcessService } from '@src/module/transaction/core/service/payment-process.service';
import { plainToInstance } from 'class-transformer';
import { PaymentRequestDto } from '../dto/request/payment-process.dto';
import { PaymentResponseDto } from '../dto/response/payment-process.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentProcessController {
  constructor(private readonly paymentProcessService: PaymentProcessService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors()
  async paymentProcess(
    @Body() data: PaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentProcessService.process(data);
    const response = plainToInstance(PaymentResponseDto, payment, {
      excludeExtraneousValues: true,
    });

    return response;
  }
}
