import { Module } from "@nestjs/common";
import { PlanerService } from "./planer.service";
import { PlanerController } from "./planer.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanerEntity } from "./entities/planer.entity";
import { ClinicEntity } from "../clinic/entities/clinic.entity";
import { ClinicService } from "../clinic/clinic.service";

@Module({
  imports: [TypeOrmModule.forFeature([PlanerEntity])],
  controllers: [PlanerController],
  providers: [PlanerService, ClinicService],
})
export class PlanerModule {}
