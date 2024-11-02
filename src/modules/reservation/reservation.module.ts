import { Module } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReservationEntity } from "./entities/reservation.entity";
import { PlanerEntity } from "../planer/entities/planer.entity";
import { AuthService } from "../auth/auth.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserOtpEntity } from "../user/entities/userotp.entity";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ReservationEntity,
      PlanerEntity,
      UserEntity,
      UserOtpEntity,
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, AuthService, JwtService],
})
export class ReservationModule {}
