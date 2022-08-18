import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';
import { Store as MedusaStore } from '@medusajs/medusa';

// Extended
import { User } from '../../user/entities/user.entity';

@MedusaEntity({ override: MedusaStore })
@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user.store)
  @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
  members: User[];
}
