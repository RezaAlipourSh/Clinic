import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ClinicService } from "./clinic.service";

@Controller("clinic")
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  create(@Body() createClinicDto) {
    return this.clinicService.create(createClinicDto);
  }

  @Get()
  findAll() {
    return this.clinicService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.clinicService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateClinicDto) {
    return this.clinicService.update(+id, updateClinicDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.clinicService.remove(+id);
  }
}
