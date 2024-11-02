import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReservationEntity } from "./entities/reservation.entity";
import { DeepPartial, LessThan, Repository } from "typeorm";
import { PlanerEntity } from "../planer/entities/planer.entity";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { PlanStatus } from "../planer/enum/plan-status.enum";
import { ReservationDto } from "./dto/reserve.dto";

@Injectable({ scope: Scope.REQUEST })
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private reserveRepo: Repository<ReservationEntity>,
    @InjectRepository(PlanerEntity)
    private planRepo: Repository<PlanerEntity>,
    @Inject(REQUEST) private req: Request
  ) {}

  async create(createReservationDto: ReservationDto) {
    const { id: userId } = this.req.user;
    const { clinicId, date, finish_visit_time, start_visit_time } =
      createReservationDto;

    const plans: DeepPartial<PlanerEntity>[] =
      await this.plansByClinicId(clinicId);

    const days = [];
    // const start_time = [];
    // const finish_time = [];
    let selectedDay: string = null;
    let start_time: string = null;
    let finish_time: string = null;

    for (const item of plans) {
      days.push(item.day_name);

      if ((item.day_name = date)) {
        selectedDay = date;
        start_time = item.start_time;
        finish_time = item.finish_time;
      }
    }

    if (plans && !days.includes(date)) {
      return {
        message:
          "in your day clinic is Closed . please choose From One of the following days.",
        clinicWorksOn: days,
      };
    }

    const lastVisit = await this.reserveRepo.findOne({
      where: {
        clinicId,
        // finish_visit_time:[LessThan:finish_time]
      },
    });

    const reserve = this.reserveRepo.create({
      userId,
      clinicId,
      date,
      finish_visit_time,
      start_visit_time,
    });

    await this.reserveRepo.save(reserve);
    return {
      message: "Reserved Successfully",
    };
  }
  // findAll() {
  //   return `This action returns all reservation`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} reservation`;
  // }
  // update(id: number, updateReservationDto) {
  //   return `This action updates a #${id} reservation`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} reservation`;
  // }

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
    console.log(plans);
    if (plans.length <= 0)
      throw new NotFoundException("Open Plan Not Founded For Clinic");
    return plans;
  }
}
