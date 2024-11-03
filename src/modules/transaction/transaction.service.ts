import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { TransactionEntity } from "./entities/transaction.entity";
import { DataSource, Repository } from "typeorm";
import { TransactionDto } from "./dto/transaction.dto";
import { ClinicEntity } from "../clinic/entities/clinic.entity";
import { TransactionStatus } from "./enum/transaction-status.enum";
import { ZarinpalService } from "../http/zarinpal.service";
import { ReservationEntity } from "../reservation/entities/reservation.entity";

@Injectable({ scope: Scope.REQUEST })
export class TransactionService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(TransactionEntity)
    private transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(ClinicEntity)
    private clinicRepo: Repository<ClinicEntity>,
    @InjectRepository(ReservationEntity)
    private reserveRepo: Repository<ReservationEntity>,
    private dataSource: DataSource,
    private zarinpalService: ZarinpalService
  ) {}

  async create(createTransactionDto: TransactionDto) {
    const { id } = createTransactionDto;
    const { id: userId } = this.req.user;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const transaction = await this.findOne(id);
      const clinic = await this.clinicRepo.findOneBy({
        id: transaction.clinicId,
      });
      const amount = clinic.cost;
      await queryRunner.manager.update(
        TransactionEntity,
        { id },
        {
          amount,
        }
      );
      if (transaction.status == TransactionStatus.UnPaid) {
        const { authority, code, gateawayUrl } =
          await this.zarinpalService.sendRequest({
            amount,
            description: "Clinic Visit",
          });
        transaction.authority = authority;
        await this.transactionRepo.save(transaction);
        return {
          gateawayUrl,
          code,
        };
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        message: "transaction sent",
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepo.findOneBy({ id });
    if (!transaction) throw new NotFoundException("Transaction Not Found");
    return transaction;
  }

  async verify(authority: string, status: string) {
    const transaction = await this.transactionRepo.findOneBy({ authority });
    if (transaction.status == TransactionStatus.Paid)
      throw new ConflictException("Already Paid");

    if (status === "OK") {
      const reservation = await this.reserveRepo.findOneBy({
        paymentId: transaction.id,
      });
      reservation.payment_status = TransactionStatus.Paid;
      await this.reserveRepo.save(reservation);
      transaction.status = TransactionStatus.Paid;
      transaction.date = new Date();
    } else {
      return "http://rzaurl.com/transaction?status=failed";
    }
    await this.transactionRepo.save(transaction);
    return "http://rzaurl.com/transaction?status=success";
  }
}
