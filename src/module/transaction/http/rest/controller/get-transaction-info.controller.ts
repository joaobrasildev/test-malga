import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { GetInfoRequestDto } from '../dto/request/get-transaction-info.dto';
import { GetTransactionInfoService } from '@src/module/transaction/core/service/get-transaction-info.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class GetTransactionInfoController {
  constructor(
    private readonly getTransactionInfoService: GetTransactionInfoService,
  ) {}
  @Get(':externalId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors()
  async getInfo(@Param() params: GetInfoRequestDto) {
    const externalId = params.externalId;
    const transactionInfo =
      await this.getTransactionInfoService.getInfo(externalId);

    return transactionInfo;
  }
}
