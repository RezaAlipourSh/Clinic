import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsString, Length } from "class-validator";

export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "invalid Mobile Number" })
  mobile: string;
}

export class checkOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "invalid Mobile Number" })
  mobile: string;
  @ApiProperty()
  @IsString()
  @Length(5, 5, { message: "incorrect Code." })
  code: string;
}
