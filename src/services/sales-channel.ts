import { Lifetime } from 'awilix'
import {
  EventBusService,
  FindConfig,
  QuerySelector,
  SalesChannelService as MedusaSalesChannelService,
  Selector,
} from '@medusajs/medusa'
import SalesChannelRepository from '../repositories/sales-channel'
import StoreService from './store'
import { User } from '../models/user'
import { EntityManager } from 'typeorm'
import {
  EntityEventType,
  MedusaEventHandlerParams,
  OnMedusaEntityEvent,
} from '../core/event-emitter'
import { SalesChannel } from '../models/sales-channel'
import { MedusaError } from 'medusa-core-utils'
import { isLoggedInUser } from '../utils'

interface Params {
  salesChannelRepository: typeof SalesChannelRepository
  eventBusService: EventBusService
  manager: EntityManager
  storeService: StoreService
  loggedInUser?: User
}

class SalesChannelService extends MedusaSalesChannelService {
  static LIFE_TIME = Lifetime.SCOPED

  private readonly salesChannelRepository: typeof SalesChannelRepository
  private readonly storeService: StoreService

  constructor(private readonly container: Params) {
    super(container)

    this.salesChannelRepository = container.salesChannelRepository
    this.storeService = container.storeService
  }

  /**
   * Bind store_id to a New Sales Channel
   */
  @OnMedusaEntityEvent.Before.Insert(SalesChannel, { async: true })
  public async addStoreIdToNewSalesChannel(
    params: MedusaEventHandlerParams<SalesChannel, 'Insert'>
  ): Promise<EntityEventType<SalesChannel, 'Insert'>> {
    const { event } = params
    if (event.entity.store_id) {
      return event
    }

    const store = await this.storeService
      .withTransaction(event.manager)
      .retrieve({
        relations: ['default_sales_channel'],
      })

    if (store) {
      event.entity.store_id = store.id
      if (!store.default_sales_channel_id) {
        await this.storeService.withTransaction(event.manager).update({
          default_sales_channel_id: event.entity.id,
        })
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Store does not exist for new Sales Channel'
      )
    }

    return event
  }

  async retrieve_(
    selector: Selector<SalesChannel>,
    config: FindConfig<SalesChannel> = {}
  ): Promise<SalesChannel> {
    if (isLoggedInUser(this.container)) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    config.select = config.select || []
    config.select.push('store_id')

    return super.retrieve_(selector, config)
  }

  async listAndCount(
    selector: QuerySelector<SalesChannel>,
    config: FindConfig<SalesChannel> = { skip: 0, take: 20 }
  ): Promise<[SalesChannel[], number]> {
    if (isLoggedInUser(this.container)) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    config.select = config.select || []
    config.select.push('store_id')

    return super.listAndCount(selector, config)
  }

  async createDefault(): Promise<SalesChannel> {
    return
  }
}

export default SalesChannelService
