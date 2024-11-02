import { ApiProperty } from "@nestjs/swagger";

export class ReservationDto {
  @ApiProperty()
  clinicId: number;
  @ApiProperty()
  start_visit_time: string;
  @ApiProperty()
  finish_visit_time: string;
  @ApiProperty()
  date: string;
  // planId:number;
}
