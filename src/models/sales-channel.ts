import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm'
import { SalesChannel as MedusaSalesChannel } from '@medusajs/medusa'
import { Store } from './store'

@Entity()
export class SalesChannel extends MedusaSalesChannel {
  @Index()
  @Column({ nullable: true })
  store_id: string

  @ManyToOne(() => Store, (store) => store.admins)
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
  store: Store
}
