import { OneToMany, Entity, JoinColumn } from 'typeorm'
import { Entity as MedusaEntity } from 'medusa-extender'
import { Store as MedusaStore } from '@medusajs/medusa/dist'
import { User } from '../user/user.entity'
import { Order } from '../order/order.entity'
import { Product } from '../product/product.entity'

@MedusaEntity({ override: MedusaStore })
@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user.store_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
  members: User[]

  @OneToMany(() => Product, (product) => product.store_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
  products: Product[]

  @OneToMany(() => Order, (order) => order.store_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
  orders: Order[]
}
