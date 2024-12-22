import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RefundProcessService } from '@src/module/transaction/core/service/refund-proccess.service';
import { RefundRequestDto } from '../dto/request/refund-process.dto';
import { RefundResponseDto } from '../dto/response/refund-process.dto';

@Controller('refunds')
export class RefundProcessController {
  constructor(private readonly refundProcessService: RefundProcessService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors()
  async refundProcess(
    @Body() data: RefundRequestDto,
  ): Promise<RefundResponseDto> {
    const refund = await this.refundProcessService.process({
      externalTransactionId: data.transactionId,
    });
    const response = plainToInstance(RefundResponseDto, refund, {
      excludeExtraneousValues: true,
    });

    return response;
  }
}
