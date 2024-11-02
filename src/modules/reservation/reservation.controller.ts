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
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserAuth } from "src/common/decorator/auth.decorator";
import { ReservationDto } from "./dto/reserve.dto";
import { FormType } from "src/common/enums/formType.enum";

@Controller("reservation")
@ApiTags("Reservation")
@UserAuth()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() createReservationDto: ReservationDto) {
    return this.reservationService.create(createReservationDto);
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
