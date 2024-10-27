import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMobilePhone, Length } from "class-validator";

export class ClinicSignupDto {
  @ApiProperty()
  @Length(3, 45)
  first_name: string;
  @ApiProperty()
  @Length(3, 50)
  last_name: string;
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "invalid mobile Format" })
  mobile: string;
  @ApiPropertyOptional()
  address: string;
  @ApiProperty()
  cost: string;
  @ApiProperty()
  categoryId: number;
}
