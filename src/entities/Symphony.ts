import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Arranger from "./Arranger";
import Composer from "./Composer";
import Performance from "./Performance";

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

  @ManyToOne(() => Arranger, { onDelete: "CASCADE" })
  arrangers: Arranger;

  @OneToMany(() => Performance, (performance) => performance.symphony)
  performances: Performance[];
}
