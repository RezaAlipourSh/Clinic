import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumberString, Length } from "class-validator";
import { PlanDayName, PlanStatus } from "../enum/plan-status.enum";

export class PlanerDto {
  @ApiProperty({ enum: PlanDayName })
  @IsEnum(PlanDayName)
  day_name: string;
  @ApiPropertyOptional()
  day_number: number;
  @ApiProperty()
  @Length(6, 6, { message: "must be 6 digit number . hour.minute.seconds" })
  @IsNumberString()
  start_time: string;
  @ApiProperty()
  @IsNumberString()
  @Length(6, 6, { message: "must be 6 digit number . hour.minute.seconds" })
  finish_time: string;
  @ApiProperty()
  clinicId: number;
  @ApiPropertyOptional({ enum: PlanStatus })
  @IsEnum(PlanStatus)
  status: string;
}

export class UpdatePlanDto {
  @ApiPropertyOptional({ enum: PlanDayName })
  day_name: string;
  @ApiPropertyOptional()
  day_number: number;
  @ApiPropertyOptional()
  start_time: string;
  @ApiPropertyOptional()
  finish_time: string;
  @ApiPropertyOptional({ enum: PlanStatus })
  status: string;
}
