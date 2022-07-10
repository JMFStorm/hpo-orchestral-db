import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Symphony from "./Symphony";

@Entity("compositor", { name: "compositors" })
export default class Arranger extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Symphony, (symphonies) => symphonies.compositors, {
    onDelete: "CASCADE",
    cascade: true,
  })
  @JoinTable()
  symphonies: Symphony[];
}
