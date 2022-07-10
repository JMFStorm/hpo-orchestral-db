import {
  BaseEntity,
  ManyToMany,
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from "typeorm";

import Concert from "./Concert";
import Symphony from "./Symphony";
import Musician from "./Musician";
import Arranger from "./Arranger";
import SoloistPerformance from "./SoloistPerformance";
import PremiereTag from "./PremiereTag";

@Entity("symphony_performance", { name: "symphony_performances" })
export default class SymphonyPerformance extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  order: number;

  @Column({ nullable: true })
  footnote: string;

  @Column()
  archive_info: string;

  @ManyToOne(() => Concert, { onDelete: "CASCADE" })
  concert: Concert;

  @ManyToOne(() => Symphony, { onDelete: "CASCADE" })
  symphony: Symphony;

  @ManyToMany(() => Musician, { onDelete: "CASCADE" })
  @JoinTable()
  conductors: Musician[];

  @ManyToOne(() => Arranger, { onDelete: "CASCADE" })
  arrangers: Arranger;

  @ManyToMany(() => SoloistPerformance, { onDelete: "CASCADE" })
  @JoinTable()
  soloist_performances: SoloistPerformance[];

  @ManyToOne(() => PremiereTag, { onDelete: "CASCADE" })
  premiere_tag: PremiereTag;
}
