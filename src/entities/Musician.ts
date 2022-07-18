import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import SoloistPerformance from "./SoloistPerformance";

@Entity("musician", { name: "musicians" })
export default class Musician extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => SoloistPerformance, (performance) => performance.soloist)
  soloist_performances: SoloistPerformance[];
}
