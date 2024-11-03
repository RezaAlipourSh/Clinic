import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntity } from "./entities/transaction.entity";
import { AuthModule } from "../auth/auth.module";
import { ClinicEntity } from "../clinic/entities/clinic.entity";
import { ReservationEntity } from "../reservation/entities/reservation.entity";
import { ZarinpalService } from "../http/zarinpal.service";
import { HttpService } from "@nestjs/axios";
import { AuthService } from "../auth/auth.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserOtpEntity } from "../user/entities/userotp.entity";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      TransactionEntity,
      ClinicEntity,
      ReservationEntity,
      UserEntity,
      UserOtpEntity,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, AuthService, JwtService],
})
export class TransactionModule {}
