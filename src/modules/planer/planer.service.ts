import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlanerEntity } from "./entities/planer.entity";
import { PlanerDto } from "./dto/Planer.dto";
import { ClinicService } from "../clinic/clinic.service";
import { ClinicEntity } from "../clinic/entities/clinic.entity";

@Injectable()
export class PlanerService {
  constructor(
    @InjectRepository(PlanerEntity) private planRepo: Repository<PlanerEntity>,
    @InjectRepository(ClinicEntity) private clinicRepo: Repository<ClinicEntity>
  ) {}

  async create(PlanerDto: PlanerDto) {
    const { clinicId, day_name, day_number, finish_time, start_time } =
      PlanerDto;
    // await this.clinicService.findOneById(clinicId);
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
}
