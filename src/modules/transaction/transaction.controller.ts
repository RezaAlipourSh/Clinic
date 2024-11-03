import { Controller, Get, Post, Body, Res, Query } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserAuth } from "src/common/decorator/auth.decorator";
import { TransactionDto } from "./dto/transaction.dto";
import { Response } from "express";
import { FormType } from "src/common/enums/formType.enum";

@Controller("transaction")
@ApiTags("Transaction")
@UserAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded)
  @ApiOperation({ summary: "Enter Your Transaction ID" })
  createTransAction(@Body() createTransactionDto: TransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get("/verify")
  async verifyTransaction(
    @Query("Authority") authority: string,
    @Query("Status") status: string,
    @Res() res: Response
  ) {
    const url = await this.transactionService.verify(authority, status);
    return res.redirect(url);
  }
}
