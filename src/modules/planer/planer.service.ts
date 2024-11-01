import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlanerEntity } from "./entities/planer.entity";
import { PlanerDto } from "./dto/Planer.dto";
import { ClinicService } from "../clinic/clinic.service";
import { ClinicEntity } from "../clinic/entities/clinic.entity";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utility/pagination.util";

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
    console.log(paginationGenerator(counts, page, limit), plans);

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
