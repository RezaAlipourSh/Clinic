import { Module } from "@nestjs/common";
import { PlanerService } from "./planer.service";
import { PlanerController } from "./planer.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanerEntity } from "./entities/planer.entity";
import { ClinicEntity } from "../clinic/entities/clinic.entity";
import { ClinicService } from "../clinic/clinic.service";
import { ClinicOtpEntity } from "../clinic/entities/clinicOtp.entity";
import { CategoryService } from "../category/category.service";
import { JwtService } from "@nestjs/jwt";
import { S3Service } from "../s3/s3.service";
import { CategoryEntity } from "../category/entities/category.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlanerEntity,
      ClinicEntity,
      ClinicOtpEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [PlanerController],
  providers: [
    PlanerService,
    ClinicService,
    CategoryService,
    JwtService,
    S3Service,
  ],
})
export class PlanerModule {}
