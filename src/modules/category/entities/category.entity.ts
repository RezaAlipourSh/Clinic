import { EntityNames } from "src/common/enums/entity-names.enum";
import { ClinicEntity } from "src/modules/clinic/entities/clinic.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityNames.Category)
export class CategoryEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column({ unique: true })
  slug: string;
  @Column({ nullable: true })
  description: string;
  @Column()
  image: string;
  @OneToMany(() => ClinicEntity, (clinic) => clinic.category)
  clinics: ClinicEntity[];
}
