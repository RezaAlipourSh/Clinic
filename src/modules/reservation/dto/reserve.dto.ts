import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, Length } from "class-validator";
import { PlanDayName } from "src/modules/planer/enum/plan-status.enum";

export class ReservationDateDto {
  @ApiProperty()
  clinicId: number;
  @ApiProperty({ enum: PlanDayName })
  @IsEnum(PlanDayName)
  date: string;
  @ApiProperty({ default: "15:20:00" })
  @Length(8, 8, { message: "enter 'hh:mm:ss' time Format " })
  start_visit_time: string;
}

export class ClinicReservesDto {
  @ApiProperty()
  clinicId: number;
  @ApiProperty({ enum: PlanDayName })
  @IsEnum(PlanDayName)
  date: string;
}
