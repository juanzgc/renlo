import { OneToMany, Entity, JoinColumn } from 'typeorm'
import { Entity as MedusaEntity } from 'medusa-extender'
import { Store as MedusaStore } from '@medusajs/medusa/dist'
import { User } from '../user/user.entity'
import { Order } from '../order/order.entity'
import { Product } from '../product/product.entity'
import { Invite } from '../invite/invite.entity'

@MedusaEntity({ override: MedusaStore })
@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user.store)
  members: User[]

  @OneToMany(() => Product, (product) => product.store)
  products: Product[]

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[]

  @OneToMany(() => Invite, (invite) => invite.store)
  invites: Invite[]
}
