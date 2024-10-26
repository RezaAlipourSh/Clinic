import { EntityNames } from "src/common/enums/entity-names.enum";
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReserveStatus } from "../enum/reserve-status.enum";
import { ClinicEntity } from "src/modules/clinic/entities/clinic.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { TransactionEntity } from "src/modules/transaction/entities/transaction.entity";

@Entity(EntityNames.Reservation)
export class ReservationEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  clinicId: number;
  @Column()
  userId: number;
  @Column()
  start_visit_time: string;
  @Column()
  finish_visit_time: string;
  @Column()
  date: string;
  @Column({ type: "enum", default: ReserveStatus.Pending })
  status: string;
  @Column()
  payment_status: string;
  @Column()
  paymentId: number;
  @ManyToOne(() => ClinicEntity, (clinic) => clinic.reserves, {
    onDelete: "CASCADE",
  })
  clinic: ClinicEntity;
  @ManyToOne(() => UserEntity, (user) => user.reserves, {
    onDelete: "CASCADE",
  })
  user: UserEntity;
  @OneToOne(() => TransactionEntity, (tranaction) => tranaction.reserve)
  payment: TransactionEntity;
}
