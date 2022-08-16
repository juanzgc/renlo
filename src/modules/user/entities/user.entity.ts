import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';
import { User as MedusaUser } from '@medusajs/medusa';

@MedusaEntity({ override: MedusaUser })
@Entity()
export class User extends MedusaUser {
  // @Index()
  @Column({ nullable: true })
  store_id: string;
}
