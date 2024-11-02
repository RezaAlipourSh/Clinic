import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { PlanerEntity } from "./entities/planer.entity";
import { PlanerDto, UpdatePlanDto } from "./dto/Planer.dto";
import { ClinicEntity } from "../clinic/entities/clinic.entity";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utility/pagination.util";
import { convertToTimeFormat } from "src/common/utility/function.util";
import { PlanDayName, PlanStatus } from "./enum/plan-status.enum";

@Injectable()
export class PlanerService {
  constructor(
    @InjectRepository(PlanerEntity) private planRepo: Repository<PlanerEntity>,
    @InjectRepository(ClinicEntity)
    private clinicRepo: Repository<ClinicEntity>
  ) {}

  async create(PlanerDto: PlanerDto) {
    const { clinicId, day_name, day_number, finish_time, start_time } =
      PlanerDto;
    const clinic = await this.clinicRepo.findOneBy({ id: clinicId });
    if (!clinic) throw new NotFoundException("not Found clinic By Id");
    await this.planRepo.insert({
      clinicId,
      day_name,
      day_number,
      finish_time,
      start_time,
    });

    return {
      message: "plan created for clinic Successfully",
    };
  }

  async update(id: number, PlanerDto: UpdatePlanDto) {
    await this.findOneById(id);
    const { day_name, day_number, finish_time, start_time, status } = PlanerDto;

    const plan: DeepPartial<PlanerEntity> = {};

    // convert values of enum to array
    let days = Object.values(PlanDayName) as string[];
    let statusplan = Object.values(PlanStatus) as string[];

    if (day_name && !days.includes(day_name))
      throw new BadRequestException("Incorrect Dayname");

    if (status && !statusplan.includes(status))
      throw new BadRequestException("Incorrect status");

    if (day_number) plan["day_number"] = +day_number;
    if (day_name) plan["day_name"] = day_name;
    if (finish_time) plan["finish_time"] = convertToTimeFormat(finish_time);
    if (start_time) plan["start_time"] = convertToTimeFormat(start_time);
    if (status) plan["status"] = status;

    await this.planRepo.update({ id }, plan);

    return {
      message: "Plan Uptaded",
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(
      paginationDto.page,
      paginationDto.limit
    );
    const [plans, counts] = await this.planRepo.findAndCount({
      where: {},
      skip,
      take: limit,
      order: { id: "DESC" },
    });

    return {
      pagination: paginationGenerator(counts, page, limit),
      plans,
    };
  }

  async findOneById(id: number) {
    const plan = await this.planRepo.findOneBy({ id });
    if (!plan) throw new NotFoundException("plan Not Founded");
    return plan;
  }

  async findClinicPlans(clinicId: number, paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(
      paginationDto.page,
      paginationDto.limit
    );
    const [plans, counts] = await this.planRepo.findAndCount({
      where: { clinicId },
      relations: {
        clinic: true,
      },

      select: {
        id: true,
        //if( Unknown column distinctAlias) => set id:true in select option
        day_name: true,
        start_time: true,
        finish_time: true,
        status: true,
        clinic: {
          last_name: true,
          address: true,
          cost: true,
        },
      },
      skip,
      take: limit,
      order: { id: "DESC" },
    });

    return {
      pagination: paginationGenerator(counts, page, limit),
      plans,
    };
  }

  async remove(id: number) {
    await this.findOneById(id);
    await this.planRepo.delete({ id });
    return {
      message: "plan deleted",
    };
  }
}
