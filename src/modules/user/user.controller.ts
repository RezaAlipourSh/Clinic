import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserAuth } from "src/common/decorator/auth.decorator";
import { ApiTags } from "@nestjs/swagger";
import { CanAccess } from "src/common/decorator/role.decorator";
import { UserRole } from "./enum/userRole.enum";
import { SkipAuth } from "src/common/decorator/skip-auth.decorator";

@Controller("user")
@ApiTags("User")
@UserAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto) {}

  @Get()
  // @SkipAuth()
  @CanAccess(UserRole.Admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto) {}

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
