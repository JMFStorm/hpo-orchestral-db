import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("concert_tag", { name: "concert_tags" })
export default class ConcertTag extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;
}
