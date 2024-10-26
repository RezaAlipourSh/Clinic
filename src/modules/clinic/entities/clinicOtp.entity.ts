import { EntityNames } from "src/common/enums/entity-names.enum";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClinicEntity } from "./clinic.entity";

@Entity(EntityNames.ClinicOtp)
export class ClinicOtpEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  code: string;
  @Column()
  expires_in: Date;
  @Column()
  clinicId: number;
  @OneToOne(() => ClinicEntity, (clinic) => clinic.otp, { onDelete: "CASCADE" })
  clinic: ClinicEntity;
}
