import { Module } from "@nestjs/common";
import { PlanerService } from "./planer.service";
import { PlanerController } from "./planer.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanerEntity } from "./entities/planer.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlanerEntity])],
  controllers: [PlanerController],
  providers: [PlanerService],
})
export class PlanerModule {}
