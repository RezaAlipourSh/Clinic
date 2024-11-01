import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
  ParseFloatPipe,
} from "@nestjs/common";
import { PlanerService } from "./planer.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PlanerDto, UpdatePlanDto } from "./dto/Planer.dto";
import { FormType } from "src/common/enums/formType.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Pagination } from "src/common/decorator/pagination.decorator";
import { ClinicAuth } from "src/common/decorator/auth.decorator";
import { SkipAuth } from "src/common/decorator/skip-auth.decorator";

@Controller("planer")
@ApiTags("Planer")
// @ClinicAuth()
export class PlanerController {
  constructor(private readonly planerService: PlanerService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() createPlanerDto: PlanerDto) {
    return this.planerService.create(createPlanerDto);
  }

  @Get()
  @Pagination()
  findAll(@Query() pagination: PaginationDto) {
    return this.planerService.findAll(pagination);
  }

  @Get(":id")
  @Pagination()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  findclinicPlans(
    @Param("id", ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto
  ) {
    return this.planerService.findClinicPlans(+id, paginationDto);
  }

  @Patch("/:id")
  //reason of error (validation failed numeric string is excepted) =>
  //because route was @Patch("/upload") instead to @Patch("/:id") - must set param with :id
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() planDto: UpdatePlanDto
  ) {
    return this.planerService.update(id, planDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.planerService.remove(+id);
  }
}
