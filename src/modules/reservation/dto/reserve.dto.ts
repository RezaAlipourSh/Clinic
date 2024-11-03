import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum } from "class-validator";
import { PlanDayName } from "src/modules/planer/enum/plan-status.enum";
import { TimesForReserve } from "../reservation.service";

export class ReservationDateDto {
  @ApiProperty()
  clinicId: number;
  @ApiProperty({ enum: PlanDayName })
  @IsEnum(PlanDayName)
  date: string;
}

export class ReserveTimeDto {
  @ApiProperty()
  reserveId: number;
  // @ApiProperty({ enum: PlanDayName })
  // @ApiProperty({ enum: TimesForReserve, isArray: true })
  @ApiProperty({ enum: TimesForReserve })
  // @IsArray()
  // @IsEnum(TimesForReserve, { each: true })
  @IsEnum(TimesForReserve)
  startTime: string;
}
