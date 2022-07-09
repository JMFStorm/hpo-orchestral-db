import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("orchestra", { name: "orchestries" })
export default class Orchestra extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;
}
