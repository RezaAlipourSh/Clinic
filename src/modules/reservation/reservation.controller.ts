import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserAuth } from "src/common/decorator/auth.decorator";
import { ClinicReservesDto, ReservationDateDto } from "./dto/reserve.dto";
import { FormType } from "src/common/enums/formType.enum";

@Controller("reservation")
@ApiTags("Reservation")
@UserAuth()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({
    summary: "select visit date & time",
  })
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() createReservationDto: ReservationDateDto) {
    return this.reservationService.create(createReservationDto);
  }

  // @Post("/visitTime")
  // @ApiOperation({
  //   summary: "select visit time",
  // })
  // @ApiConsumes(FormType.Urlencoded, FormType.Json)
  // visitTime(@Body() ReservationDto: ReserveTimeDto) {
  //   return this.reservationService.selectVisitTime(ReservationDto);
  // }

  @Get("/clinicReserves")
  @ApiConsumes(FormType.Urlencoded)
  findAll(@Query() dto: ClinicReservesDto) {
    return this.reservationService.findAllClinicReserveByDate(dto);
  }

  @Get(":id")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  findOne(@Param("id") id: string) {
    return this.reservationService.findOne(+id);
  }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateReservationDto) {
  //   return this.reservationService.update(+id, updateReservationDto);
  // }

  @Delete(":id")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  remove(@Param("id") id: string) {
    return this.reservationService.remove(+id);
  }
}
