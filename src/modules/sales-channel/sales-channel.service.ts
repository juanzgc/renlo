import { Service } from 'medusa-extender'
import { EntityManager } from 'typeorm'

import { SalesChannelService as MedusaSalesChannelService } from '@medusajs/medusa/dist/services'
import { User } from '../user/user.entity'
import SalesChannelRepository from './sales-channel.repository'
import StoreService from '../store/store.service'
import { EventBusService } from '@medusajs/medusa'

type ConstructorParams = {
  salesChannelRepository: typeof SalesChannelRepository
  eventBusService: EventBusService
  manager: EntityManager
  storeService: StoreService
  loggedInUser?: User
}

@Service({ override: MedusaSalesChannelService, scope: 'SCOPED' })
export default class SalesChannelService extends MedusaSalesChannelService {
  private readonly manager: EntityManager
  private readonly salesChannelRepository: typeof SalesChannelRepository

  constructor(private readonly container: ConstructorParams) {
    super(container)
    this.manager = container.manager
    this.salesChannelRepository = container.salesChannelRepository
  }
}
