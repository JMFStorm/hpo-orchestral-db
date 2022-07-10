import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("musician", { name: "musicians" })
export default class Musician extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;
}
