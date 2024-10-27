import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlanerEntity } from "./entities/planer.entity";
import { PlanerDto } from "./dto/Planer.dto";
import { ClinicService } from "../clinic/clinic.service";

@Injectable()
export class PlanerService {
  constructor(
    @InjectRepository(PlanerEntity) private planRepo: Repository<PlanerEntity>,
    private clinicService: ClinicService
  ) {}

  async create(PlanerDto: PlanerDto) {
    const { clinicId, day_name, day_number, finish_time, start_time } =
      PlanerDto;
    await this.clinicService.findOneById(clinicId);
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
