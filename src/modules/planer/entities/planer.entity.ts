import { EntityNames } from "src/common/enums/entity-names.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlanStatus } from "../enum/plan-status.enum";
import { ClinicEntity } from "src/modules/clinic/entities/clinic.entity";

@Entity(EntityNames.Planer)
export class PlanerEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  day_name: string;
  @Column()
  day_number: string;
  @Column()
  start_time: string;
  @Column()
  finish_time: string;
  @Column({ type: "enum", enum: PlanStatus, default: PlanStatus.Open })
  status: string;
  @Column({ nullable: true })
  clinicId: number;
  @ManyToOne(() => ClinicEntity, (clinic) => clinic.plan)
  clinic: ClinicEntity;
}
