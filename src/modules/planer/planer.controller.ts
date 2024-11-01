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
} from "@nestjs/common";
import { PlanerService } from "./planer.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PlanerDto } from "./dto/Planer.dto";
import { FormType } from "src/common/enums/formType.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Pagination } from "src/common/decorator/pagination.decorator";

@Controller("planer")
@ApiTags("Planer")
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

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.planerService.findOne(+id);
  // }

  @Get(":id")
  @Pagination()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto
  ) {
    return this.planerService.findClinicPlans(+id, paginationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.planerService.remove(+id);
  }
}
