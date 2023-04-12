import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Order as MedusaOrder } from '@medusajs/medusa'
import { Store } from './store'

@Entity()
export class Order extends MedusaOrder {
  @Index()
  @Column({ nullable: false })
  store_id: string

  @ManyToOne(() => Store, (store) => store.orders)
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
  store: Store
}
