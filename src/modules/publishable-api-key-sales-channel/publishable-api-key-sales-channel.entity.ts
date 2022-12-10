import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';
import { PublishableApiKeySalesChannel as MedusaPublishableApiKeySalesChannel } from '@medusajs/medusa/dist/models/publishable-api-key-sales-channel';

@MedusaEntity({ override: MedusaPublishableApiKeySalesChannel })
@Entity()
export class PublishableApiKeySalesChannel extends MedusaPublishableApiKeySalesChannel {
  @Column({ nullable: true })
  store_id: string;
}
