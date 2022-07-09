import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import SoloistPerformance from "./SoloistPerformance";

@Entity("instrument", { name: "instruments" })
export default class Instrument extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => SoloistPerformance, (soloist_performances) => soloist_performances.instrument, {
    onDelete: "CASCADE",
  })
  soloist_performances: SoloistPerformance[];
}
