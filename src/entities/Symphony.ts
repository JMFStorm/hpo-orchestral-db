import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Compositor from "./Compositor";

@Entity("symphony", { name: "symphonies" })
export default class Symphony extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  symphony_id: string;

  @Column()
  name: string;

  @ManyToMany(() => Compositor, (compositors) => compositors.symphonies, {
    onDelete: "CASCADE",
  })
  compositors: Compositor[];
}
