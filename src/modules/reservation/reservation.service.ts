import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReservationEntity } from "./entities/reservation.entity";
import { DeepPartial, Repository } from "typeorm";
import { PlanerEntity } from "../planer/entities/planer.entity";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { PlanStatus } from "../planer/enum/plan-status.enum";
import { ClinicReservesDto, ReservationDateDto } from "./dto/reserve.dto";
import { divideTimeDifference } from "src/common/utility/function.util";
import { TransactionEntity } from "../transaction/entities/transaction.entity";

@Injectable({ scope: Scope.REQUEST })
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private reserveRepo: Repository<ReservationEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(PlanerEntity)
    private planRepo: Repository<PlanerEntity>,
    @Inject(REQUEST) private req: Request
  ) {}

  async create(createReservationDto: ReservationDateDto) {
    const { id: userId } = this.req.user;
    const { clinicId, date, start_visit_time } = createReservationDto;

    const plans: DeepPartial<PlanerEntity>[] =
      await this.plansByClinicId(clinicId);

    await this.findUserReserve(userId, date, clinicId);

    const days = [];
    let selectedDay: string = null;

    for (const item of plans) {
      days.push(item.day_name);
      if (item.day_name === date) {
        selectedDay = date;
      }
    }

    if (plans && !days.includes(date)) {
      return {
        message:
          "in this day clinic is Closed . please choose From One of the following days.",
        clinicWorksOn: days,
      };
    }

    const allTimes = await this.reservationTimes(clinicId, date);
    const availableTimes = await this.reservedTimes(allTimes, date, clinicId);

    if (!availableTimes.includes(start_visit_time)) {
      return {
        meesage:
          "Time You Choosed isn't Available . please select from Folowing ReserveTime.",
        availableTimes,
      };
    }

    let reserve = this.reserveRepo.create({
      userId,
      clinicId,
      date,
      start_visit_time,
    });
    reserve = await this.reserveRepo.save(reserve);

    let transaction = this.transactionRepo.create({
      clinicId,
      reservationId: reserve.id,
      userId,
    });

    transaction = await this.transactionRepo.save(transaction);

    return {
      reserveID: reserve.id,
      message: "Time reserved",
      transactionId: transaction.id,
    };
  }

  async findAllClinicReserveByDate(dto: ClinicReservesDto) {
    const { clinicId, date } = dto;
    const [reserve, count] = await this.reserveRepo.findAndCount({
      where: {
        clinicId,
        date,
      },
    });

    if (!reserve)
      throw new NotFoundException(
        " Not found any Reservation . check date & clinicId"
      );
    // console.log(reserve);
    return {
      Count: count,
      reserve,
    };
  }

  // async selectVisitTime(reservationId: number, start_time: string) {
  // async selectVisitTime(reservation: ReserveTimeDto) {
  //   const { reserveId, startTime } = reservation;
  //   const reserve = await this.reserveRepo.findOneBy({ id: reserveId });
  //   const clinicId = reserve.clinicId;
  //   const date = reserve.date;
  //   const allTimes = await this.reservationTimes(clinicId, date);
  //   const availableTimes = await this.reservedTimes(allTimes, date, clinicId);

  //   if (!availableTimes.includes(startTime))
  //     return {
  //       message:
  //         "this time is reserved. Select Another time Please from Following times",
  //       availableTime: availableTimes,
  //     };
  //   reserve.start_visit_time = startTime;
  //   await this.reserveRepo.save(reserve);

  //   return {
  //     message: "Selected time Reserved",
  //   };
  // }

  async reservationTimes(clinicId: number, date: string) {
    const plans: DeepPartial<PlanerEntity>[] =
      await this.plansByClinicId(clinicId);

    let reservation: string[] = [];

    let start_time: string = null;
    let finish_time: string = null;
    for (const item of plans) {
      if (item.day_name === date) {
        start_time = item.start_time;
        finish_time = item.finish_time;
      }
    }

    reservation = divideTimeDifference(start_time, finish_time, 20);
    return reservation;
  }

  async reservedTimes(times: string[], date: string, clinicId: number) {
    let availableTimes: string[] = [];

    for (const time of times) {
      const reservedtimes = await this.reserveRepo.findOne({
        where: {
          clinicId,
          date,
          start_visit_time: time,
        },
      });
      if (!reservedtimes) availableTimes.push(time);
      // TimesForReserve[time] = time;
    }
    if (availableTimes.length <= 0)
      throw new NotFoundException("Sorry There Isn't Availble Time.");
    return availableTimes;
  }

  async findOne(id: number) {
    const reserve = await this.reserveRepo.findOneBy({ id });
    if (!reserve) throw new NotFoundException("Reserve Not Found");
    return reserve;
  }
  async findUserReserve(userId: number, date: string, clinicId: number) {
    const reserve = await this.reserveRepo.findOneBy({
      userId,
      date,
      clinicId,
    });
    if (reserve)
      throw new ConflictException(
        "you can reserve a one visitTime per day . delete your last reserve then try again-"
      );
    return true;
  }
  async remove(id: number) {
    await this.findOne(id);
    await this.reserveRepo.delete({ id });
    return {
      message: "Reservation Removed.",
    };
  }

  async plansByClinicId(id: number) {
    const plans = await this.planRepo.find({
      where: {
        clinicId: id,
        status: PlanStatus.Open,
      },
      select: {
        status: false,
      },
      order: { id: "DESC" },
    });
    if (plans.length <= 0)
      throw new NotFoundException("Open Plan Not Founded For Clinic ");
    return plans;
  }
}

// export let TimesForReserve: { [key: string]: string } = {
//   Select: "select",
// };
