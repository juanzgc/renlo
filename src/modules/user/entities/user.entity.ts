import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';
import { User as MedusaUser } from '@medusajs/medusa';
import { Store } from '../../store/entities/store.entity';

@MedusaEntity({ override: MedusaUser })
@Entity()
export class User extends MedusaUser {
  @Index()
  @Column({ nullable: false })
  store_id: string;

  @ManyToOne(() => Store, (store) => store.tenant_members)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
