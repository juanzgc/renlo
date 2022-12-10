import { Product as MedusaProduct } from '@medusajs/medusa';
import { Column, Entity } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';

@MedusaEntity()
@Entity()
export class Product extends MedusaProduct {
  @Column({ nullable: false })
  store_id: string;

  @Column({ nullable: false })
  store_id_2: string;
}
