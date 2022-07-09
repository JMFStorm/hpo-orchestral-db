import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("premiere_tag", { name: "premiere_tags" })
export default class PremiereTag extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;
}
