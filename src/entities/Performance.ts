import { BaseEntity, ManyToMany, Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinTable } from "typeorm";

import Concert from "./Concert";
import Symphony from "./Symphony";
import SoloistPerformance from "./SoloistPerformance";
import PremiereTag from "./PremiereTag";

@Entity("performance", { name: "performances" })
export default class Performance extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  order: number;

  @Column()
  is_encore: boolean;

  @ManyToOne(() => Concert, { onDelete: "CASCADE" })
  concert: Concert;

  @ManyToOne(() => Symphony, { onDelete: "CASCADE" })
  symphony: Symphony;

  @ManyToMany(() => SoloistPerformance, (soloistPerf) => soloistPerf.performance, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  soloist_performances: SoloistPerformance[];

  @ManyToOne(() => PremiereTag, { onDelete: "CASCADE" })
  premiere_tag: PremiereTag;
}
