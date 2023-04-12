import { Index, Column, Entity, ManyToOne, JoinColumn } from 'typeorm'
import { Product as MedusaProduct } from '@medusajs/medusa'
import { Store } from './store'

@Entity()
export class Product extends MedusaProduct {
  @Index()
  @Column({ nullable: false })
  store_id: string

  @ManyToOne(() => Store, (store) => store.admins)
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
  store: Store
}
