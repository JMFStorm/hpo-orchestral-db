import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Concert from "./Concert";

@Entity("conductor", { name: "conductors" })
export default class Conductor extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Concert, (concert) => concert.conductors, { onDelete: "CASCADE" })
  concerts: Concert[];
}
