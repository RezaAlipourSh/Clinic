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

@Controller("reservation")
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Body() createReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reservationService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateReservationDto) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.reservationService.remove(+id);
  }
}