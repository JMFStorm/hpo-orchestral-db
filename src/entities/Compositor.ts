import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("compositor", { name: "compositors" })
export default class Arranger extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  names: string;
}
