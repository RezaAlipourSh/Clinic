import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { PlanDayName } from "src/modules/planer/enum/plan-status.enum";

export class ReservationDto {
  @ApiProperty()
  clinicId: number;
  @ApiProperty()
  start_visit_time: string;
  @ApiProperty()
  finish_visit_time: string;
  @ApiProperty({ enum: PlanDayName })
  @IsEnum(PlanDayName)
  date: string;
}
