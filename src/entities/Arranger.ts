import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("arranger", { name: "arrangers" })
export default class Arranger extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  names: string;
}
