import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';
import { Store as MedusaStore } from '@medusajs/medusa/dist';
import { User } from '../../user/entities/user.entity';
export { Currency } from '@medusajs/medusa/dist';
export { SalesChannel } from '@medusajs/medusa/dist';

@MedusaEntity({ override: MedusaStore })
@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user.store)
  @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
  tenant_members: User[];
}
