import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { UserOtpEntity } from "../user/entities/userotp.entity";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserOtpEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
