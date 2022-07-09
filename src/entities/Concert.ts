import { BaseEntity, Column, OneToMany, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import Location from "./Location";
import Orchestra from "./Orchestra";
import ConcertTag from "./ConcertTag";
import SymphonyPerformance from "./SymphonyPerformance";

@Entity("concert", { name: "concerts" })
export default class Concert extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  concert_id: string;

  @Column()
  date: string;

  @Column({ nullable: true })
  starting_time: string;

  @ManyToOne(() => Location, { onDelete: "CASCADE" })
  location: Location;

  @ManyToOne(() => Orchestra, { onDelete: "CASCADE" })
  orchestra: Orchestra;

  @ManyToOne(() => ConcertTag, { onDelete: "CASCADE" })
  concert_tag: ConcertTag;

  @OneToMany(() => SymphonyPerformance, (symphony_performance) => symphony_performance.concert, {
    onDelete: "CASCADE",
  })
  symphony_performance: SymphonyPerformance;
}
