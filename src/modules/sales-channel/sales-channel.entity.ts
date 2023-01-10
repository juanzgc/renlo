import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Entity as MedusaEntity } from 'medusa-extender'
import { SalesChannel as MedusaSalesChannel } from '@medusajs/medusa'
import { Store } from '../store/store.entity'

@MedusaEntity({ override: MedusaSalesChannel })
@Entity()
export class SalesChannel extends MedusaSalesChannel {
  @Index()
  @Column({ nullable: true })
  store_id: string

  @ManyToOne(() => Store, (store) => store.members)
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
  store: Store
}
