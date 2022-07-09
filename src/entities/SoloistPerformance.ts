import { BaseEntity, ManyToMany, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import Musician from "./Musician";
import Instrument from "./Instrument";
import SymphonyPerformance from "./SymphonyPerformance";

@Entity("soloist_performance", { name: "soloist_performances" })
export default class SoloistPerformance extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Musician, { onDelete: "CASCADE" })
  soloist: Musician;

  @ManyToOne(() => Instrument, { onDelete: "CASCADE" })
  instrument: Instrument;

  @ManyToMany(() => SymphonyPerformance, { onDelete: "CASCADE" })
  symphony_performance: SymphonyPerformance;
}
