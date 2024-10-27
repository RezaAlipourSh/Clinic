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
import { ApiTags } from "@nestjs/swagger";
import { ClinicSignupDto } from "./dto/clinic.dto";
import { checkOtpDto } from "../auth/dto/otp.dto";

@Controller("clinic")
@ApiTags("clinic")
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post("/signup")
  signup(@Body() createClinicDto: ClinicSignupDto) {
    return this.clinicService.create(createClinicDto);
  }

  @Post("/check-otp")
  checkOtp(@Body() otpDto: checkOtpDto) {
    return this.clinicService.checkOtp(otpDto);
  }
}
