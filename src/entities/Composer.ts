import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Symphony from "./Symphony";

@Entity("composer", { name: "composers" })
export default class Composer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Symphony, (symphonies) => symphonies.composers, {
    onDelete: "CASCADE",
    cascade: true,
  })
  @JoinTable()
  symphonies: Symphony[];
}
