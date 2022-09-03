import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';
import { Store as MedusaStore } from '../../../../node_modules/@medusajs/medusa';

// Extended
import { User } from '../../user/entities/user.entity';

// Export for migration
export { Currency } from '@medusajs/medusa/dist/models/currency';

@MedusaEntity({ override: MedusaStore })
@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user.store)
  @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
  members: User[];
}
