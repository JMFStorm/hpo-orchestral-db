import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("symphony", { name: "symphonies" })
export default class Symphony extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  symphony_id: string;

  @Column()
  name: string;
}
