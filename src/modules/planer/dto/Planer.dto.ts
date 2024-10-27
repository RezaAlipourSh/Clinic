import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Length } from "class-validator";

export class PlanerDto {
  @ApiProperty()
  day_name: string;
  @ApiPropertyOptional()
  day_number: number;
  @ApiProperty()
  @Length(4, 4, { message: "must be 4 digit number" })
  start_time: string;
  @ApiProperty()
  @Length(4, 4, { message: "must be 4 digit number" })
  finish_time: string;
  @ApiProperty()
  clinicId: number;
}
