import { EntityNames } from "src/common/enums/entity-names.enum";
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TransactionStatus } from "../enum/transaction-status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { ClinicEntity } from "src/modules/clinic/entities/clinic.entity";
import { ReservationEntity } from "src/modules/reservation/entities/reservation.entity";

@Entity(EntityNames.Transactions)
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  clinicId: number;
  @Column()
  userId: number;
  @Column()
  reservationId: number;
  @Column({ nullable: true })
  amount: string;
  @Column({ nullable: true })
  authority: string;
  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.UnPaid,
  })
  status: string;
  @Column({ nullable: true })
  date: Date;
  @ManyToOne(() => UserEntity, (user) => user.transactions, {})
  user: UserEntity;
  @ManyToOne(() => ClinicEntity, (clinic) => clinic.transactions, {})
  clinic: ClinicEntity;
  @OneToOne(() => ReservationEntity, (reserve) => reserve.payment)
  reserve: ReservationEntity;
}
