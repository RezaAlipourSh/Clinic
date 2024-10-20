import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormType } from "src/common/enums/formType.enum";
import { checkOtpDto, SendOtpDto } from "./dto/otp.dto";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/sendOtp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  sendOtp(@Body() otpDto: SendOtpDto) {
    return this.authService.sendOtp(otpDto);
  }

  @Post("/checkOtp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  checkOtp(@Body() otpDto: checkOtpDto) {
    return this.authService.checkOtp(otpDto);
  }
}
