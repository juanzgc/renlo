import { Entity, JoinColumn, OneToMany } from 'typeorm'
import { Store as MedusaStore } from '@medusajs/medusa'
import { Product } from './product'
import { User } from './user'
import { Order } from './order'
import { Invite } from './invite'

@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user.store)
  admins: User[]

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[]

  @OneToMany(() => Product, (product) => product.store)
  products: Product[]

  @OneToMany(() => Invite, (invite) => invite.store)
  @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
  invites: Invite[]
}
