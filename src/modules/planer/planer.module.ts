import { Module } from "@nestjs/common";
import { PlanerService } from "./planer.service";
import { PlanerController } from "./planer.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanerEntity } from "./entities/planer.entity";
import { ClinicEntity } from "../clinic/entities/clinic.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlanerEntity, ClinicEntity])],
  controllers: [PlanerController],
  providers: [PlanerService],
})
export class PlanerModule {}
