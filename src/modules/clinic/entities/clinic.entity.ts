import { EntityNames } from "src/common/enums/entity-names.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ClinicStatus } from "../enum/clinicStatus.enum";
import { ClinicOtpEntity } from "./clinicOtp.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { PlanerEntity } from "src/modules/planer/entities/planer.entity";
import { ReservationEntity } from "src/modules/reservation/entities/reservation.entity";
import { TransactionEntity } from "src/modules/transaction/entities/transaction.entity";

@Entity(EntityNames.Clinic)
export class ClinicEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ unique: true })
  mobile: string;
  @Column({ nullable: true, default: false })
  mobile_verify: boolean;
  @Column({ nullable: true })
  address: string;
  @Column({ default: 200000 })
  cost: string;
  @Column({ nullable: true })
  categoryId: number;
  @Column({ nullable: true })
  otpId: number;
  @Column({ type: "enum", enum: ClinicStatus, default: ClinicStatus.Pending })
  status: string;
  @Column({ nullable: true })
  confirmed_at: Date;
  @CreateDateColumn()
  created_at: Date;
  @OneToOne(() => ClinicOtpEntity, (otp) => otp.clinic)
  @JoinColumn()
  otp: ClinicOtpEntity;
  @ManyToOne(() => CategoryEntity, (category) => category.clinics, {
    onDelete: "SET NULL",
  })
  category: CategoryEntity;
  @OneToMany(() => PlanerEntity, (plan) => plan.clinic)
  plan: PlanerEntity[];
  @OneToMany(() => ReservationEntity, (reserve) => reserve.clinic)
  reserves: ReservationEntity[];
  @OneToMany(() => TransactionEntity, (transaction) => transaction.clinic)
  transactions: TransactionEntity[];
}
