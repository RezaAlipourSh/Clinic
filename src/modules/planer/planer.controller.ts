import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { PlanerService } from "./planer.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PlanerDto } from "./dto/Planer.dto";
import { FormType } from "src/common/enums/formType.enum";

@Controller("planer")
@ApiTags("Planer")
export class PlanerController {
  constructor(private readonly planerService: PlanerService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() createPlanerDto: PlanerDto) {
    return this.planerService.create(createPlanerDto);
  }

  // @Get()
  // findAll() {
  //   return this.planerService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.planerService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updatePlanerDto) {
  //   return this.planerService.update(+id, updatePlanerDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.planerService.remove(+id);
  // }
}
