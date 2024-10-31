import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, Length } from "class-validator";
import { PlanDayName } from "../enum/plan-status.enum";

export class PlanerDto {
  @ApiProperty({ enum: PlanDayName })
  @IsEnum(PlanDayName)
  day_name: string;
  @ApiPropertyOptional()
  day_number: number;
  @ApiProperty()
  @Length(6, 6, { message: "must be 6 digit number . hour.minute.seconds" })
  start_time: string;
  @ApiProperty()
  @Length(6, 6, { message: "must be 6 digit number . hour.minute.seconds" })
  finish_time: string;
  @ApiProperty()
  clinicId: number;
}
