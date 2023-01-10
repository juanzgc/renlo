import { Repository as MedusaRepository, Utils } from 'medusa-extender'
import { EntityRepository } from 'typeorm'
import { SalesChannelRepository as MedusaSalesChannelRepository } from '@medusajs/medusa/dist/repositories/sales-channel'
import { SalesChannel } from './sales-channel.entity'

@MedusaRepository({ override: MedusaSalesChannelRepository })
@EntityRepository(SalesChannel)
export default class SalesChannelRepository extends Utils.repositoryMixin<
  SalesChannel,
  MedusaSalesChannelRepository
>(MedusaSalesChannelRepository) {}
