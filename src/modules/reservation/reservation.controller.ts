import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserAuth } from "src/common/decorator/auth.decorator";
import { ReservationDateDto, ReserveTimeDto } from "./dto/reserve.dto";
import { FormType } from "src/common/enums/formType.enum";

@Controller("reservation")
@ApiTags("Reservation")
@UserAuth()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({
    summary: "select visit date - then choose visit time on another Route",
  })
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() createReservationDto: ReservationDateDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Post("/visitTime")
  @ApiOperation({
    summary: "select visit time",
  })
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  visitTime(@Body() ReservationDto: ReserveTimeDto) {
    return this.reservationService.selectVisitTime(ReservationDto);
  }

  // @Get()
  // findAll() {
  //   return this.reservationService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.reservationService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateReservationDto) {
  //   return this.reservationService.update(+id, updateReservationDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.reservationService.remove(+id);
  // }
}
