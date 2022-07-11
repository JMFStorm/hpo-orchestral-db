import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Composer from "./Composer";

@Entity("symphony", { name: "symphonies" })
export default class Symphony extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  symphony_id: string;

  @Column()
  name: string;

  @ManyToMany(() => Composer, (composers) => composers.symphonies, {
    onDelete: "CASCADE",
  })
  composers: Composer[];
}
