import {
  BaseEntity,
  Column,
  OneToMany,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from "typeorm";

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

  @Column("date", { nullable: true })
  date: string;

  @Column("time", { nullable: true })
  starting_time: string;

  @ManyToOne(() => Location, { onDelete: "CASCADE" })
  location: Location;

  @ManyToOne(() => Orchestra, { onDelete: "CASCADE" })
  orchestra: Orchestra;

  @ManyToOne(() => ConcertTag, { onDelete: "CASCADE" })
  concert_tag: ConcertTag;

  @OneToMany(() => SymphonyPerformance, (symphony_performances) => symphony_performances.concert, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  symphony_performances: SymphonyPerformance[];
}
