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
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ClinicSignupDto } from "./dto/clinic.dto";
import { checkOtpDto } from "../auth/dto/otp.dto";
import { FormType } from "src/common/enums/formType.enum";

@Controller("clinic")
@ApiTags("clinic")
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post("/signup")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  signup(@Body() createClinicDto: ClinicSignupDto) {
    return this.clinicService.create(createClinicDto);
  }

  @Post("/check-otp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  checkOtp(@Body() otpDto: checkOtpDto) {
    return this.clinicService.checkOtp(otpDto);
  }
}
