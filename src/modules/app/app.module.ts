import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { ClinicModule } from "../clinic/clinic.module";
import { CategoryModule } from "../category/category.module";
import { PlanerModule } from "../planer/planer.module";
import { ReservationModule } from "../reservation/reservation.module";
import { TransactionModule } from "../transaction/transaction.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    ClinicModule,
    CategoryModule,
    PlanerModule,
    ReservationModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
