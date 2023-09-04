import {
  Service,
  OnMedusaEntityEvent,
  MedusaEventHandlerParams,
  EntityEventType,
} from 'medusa-extender'
import { EntityManager } from 'typeorm'
import { MedusaError } from 'medusa-core-utils'

import { SalesChannelService as MedusaSalesChannelService } from '@medusajs/medusa/dist/services'
import { User } from '../user/user.entity'
import SalesChannelRepository from './sales-channel.repository'
import StoreService from '../store/store.service'
import { EventBusService } from '@medusajs/medusa'
import { SalesChannel } from './sales-channel.entity'
import SalesChannelSubscriber from './sales-channel.subscriber'
import { CreateSalesChannelInput } from '@medusajs/medusa/dist/types/sales-channels'
import { QuerySelector, FindConfig } from '@medusajs/medusa/dist/types/common'

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
  private readonly storeService: StoreService

  constructor(private readonly container: ConstructorParams) {
    super(container)
    this.manager = container.manager
    this.storeService = container.storeService
    this.salesChannelRepository = container.salesChannelRepository

    SalesChannelSubscriber.attachTo(this.manager.connection)
  }

  // Retrieve store_id and set it on the New Sales Channel
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

    return params.event
  }

  async create(
    data: CreateSalesChannelInput & { store_id?: string }
  ): Promise<SalesChannel | never> {
    return super.create(data) as Promise<SalesChannel | never>
  }

  /**
   * Creates a default sales channel, if this does not already exist.
   * @return the sales channel
   */
  async createDefault(): Promise<SalesChannel> {
    return this.atomicPhase_(async (transactionManager) => {
      const store = await this.storeService
        .withTransaction(transactionManager)
        .retrieve({
          relations: ['default_sales_channel'],
        })

      if (store.default_sales_channel_id) {
        return store.default_sales_channel
      }

      const defaultSalesChannel = await this.create({
        description: 'Created by Renlo',
        name: 'Default Sales Channel',
        is_disabled: false,
        store_id: store.id, // Add store_id to create
      })

      await this.storeService.withTransaction(transactionManager).update({
        default_sales_channel_id: defaultSalesChannel.id,
      })

      return defaultSalesChannel as SalesChannel
    }) as Promise<SalesChannel>
  }

  async listAndCount(
    selector: QuerySelector<SalesChannel>,
    config?: FindConfig<SalesChannel>
  ): Promise<[SalesChannel[], number]> {
    if (
      Object.keys(this.container).includes('loggedInUser') &&
      this.container.loggedInUser.store_id
    ) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    return super.listAndCount(selector, config as any) as unknown as Promise<
      [SalesChannel[], number]
    >
  }
}
