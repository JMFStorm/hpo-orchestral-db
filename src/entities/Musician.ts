import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import SoloistPerformance from "./SoloistPerformance";

@Entity("musician", { name: "musicians" })
export default class Musician extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => SoloistPerformance, (soloist_performances) => soloist_performances.soloist, {
    onDelete: "CASCADE",
  })
  soloist_performances: SoloistPerformance[];
}
