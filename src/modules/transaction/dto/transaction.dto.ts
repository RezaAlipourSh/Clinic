import { ApiProperty } from "@nestjs/swagger";

export class TransactionDto {
  @ApiProperty()
  id: number;
}
