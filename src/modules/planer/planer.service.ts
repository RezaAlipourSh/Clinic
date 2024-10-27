import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlanerEntity } from "./entities/planer.entity";

@Injectable()
export class PlanerService {
  constructor(
    @InjectRepository(PlanerEntity) private planRepo: Repository<PlanerEntity>
  ) {}

  create(PlanerDto) {
    return "This action adds a new planer";
  }
}
