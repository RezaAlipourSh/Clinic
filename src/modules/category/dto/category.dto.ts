import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty()
  title: string;
  @ApiPropertyOptional({ nullable: true })
  slug: string;
  @ApiPropertyOptional({ nullable: true })
  description: string;
  @ApiProperty({ format: "binary" })
  image: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
