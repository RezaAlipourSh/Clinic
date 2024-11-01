import { EntityNames } from "src/common/enums/entity-names.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserOtpEntity } from "./userotp.entity";
import { ReservationEntity } from "src/modules/reservation/entities/reservation.entity";
import { TransactionEntity } from "src/modules/transaction/entities/transaction.entity";
import { UserRole } from "../enum/userRole.enum";

@Entity(EntityNames.User)
export class UserEntity {
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
  @Column({ type: "enum", enum: UserRole, default: UserRole.User })
  role: string;
  @CreateDateColumn()
  created_at: Date;
  @Column({ nullable: true })
  otpId: number;
  @OneToOne(() => UserOtpEntity, (otp) => otp.user)
  @JoinColumn()
  otp: UserOtpEntity;
  @OneToMany(() => ReservationEntity, (reserve) => reserve.user)
  reserves: ReservationEntity[];
  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions: TransactionEntity[];
}
