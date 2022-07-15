import {
  BaseEntity,
  Column,
  OneToMany,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from "typeorm";

import Location from "./Location";
import Orchestra from "./Orchestra";
import ConcertTag from "./ConcertTag";
import Performance from "./Performance";
import Musician from "./Musician";

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

  @ManyToMany(() => Musician, { onDelete: "CASCADE" })
  @JoinTable()
  conductors: Musician[];

  @OneToMany(() => Performance, (performances) => performances.concert, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  performances: Performance[];
}
