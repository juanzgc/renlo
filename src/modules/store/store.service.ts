import {
  EntityEventType,
  MedusaEventHandlerParams,
  OnMedusaEntityEvent,
  Service,
} from 'medusa-extender'
import { EntityManager } from 'typeorm'
import { MedusaError } from 'medusa-core-utils'

import { CurrencyRepository } from '@medusajs/medusa/dist/repositories/currency'
import { EventBusService } from '@medusajs/medusa'
import { StoreService as MedusaStoreService } from '@medusajs/medusa'
import { Store } from './store.entity'
import StoreRepository from './store.repository'
import { User } from '../user/user.entity'
import { FindConfig } from '@medusajs/medusa/dist/types/common'
import SalesChannelService from '../sales-channel/sales-channel.service'
import SalesChannelRepository from '../sales-channel/sales-channel.repository'
import { Invite } from '../invite/invite.entity'

interface ConstructorParams {
  loggedInUser?: User
  manager: EntityManager
  storeRepository: typeof StoreRepository
  currencyRepository: typeof CurrencyRepository
  eventBusService: EventBusService
  salesChannelRepository: typeof SalesChannelRepository
}

@Service({ override: MedusaStoreService, scope: 'SCOPED' })
export default class StoreService extends MedusaStoreService {
  private readonly manager: EntityManager
  private readonly storeRepository: typeof StoreRepository
  private readonly salesChannelRepository: typeof SalesChannelRepository
  private readonly currencyRepository: typeof CurrencyRepository

  constructor(private readonly container: ConstructorParams) {
    super(container)
    this.manager = container.manager
    this.storeRepository = container.storeRepository
    this.salesChannelRepository = container.salesChannelRepository
    this.currencyRepository = container.currencyRepository
  }

  @OnMedusaEntityEvent.Before.Insert(User, { async: true })
  public async createStoreForNewUser(
    params: MedusaEventHandlerParams<User, 'Insert'>
  ): Promise<EntityEventType<User, 'Insert'>> {
    const { event } = params
    let store_id = Object.keys(this.container).includes('loggedInUser')
      ? this.container.loggedInUser.store_id
      : null
    if (!store_id) {
      // Create Store for new user
      const createdStore = await this.withTransaction(
        event.manager
      ).createForUser(event.entity)
      if (!!createdStore) {
        store_id = createdStore.id
      }
    }

    event.entity.store_id = store_id

    return event
  }

  /**
   * Create a store for a particular user. It mainly used from the event BeforeInsert to create a store
   * for the user that is being inserting.
   * @param user
   */
  public async createForUser(user: User): Promise<Store | void> {
    if (user.store_id) {
      return
    }
    const storeRepo = this.manager.getCustomRepository(this.storeRepository)
    const currencyRepo = this.manager.getCustomRepository(
      this.currencyRepository
    )

    const store = storeRepo.create() as Store
    // Add default currency (USD) to store currencies
    const usd = await currencyRepo.findOne({
      code: 'usd',
    })

    if (usd) {
      store.currencies = [usd]
    }

    await storeRepo.save(store)

    const salesChannelRepo = this.manager.getCustomRepository(
      this.salesChannelRepository
    )
    const salesChannel = salesChannelRepo.create({
      description: 'Created by Renlo',
      name: 'Default Sales Channel',
      is_disabled: false,
      store_id: store.id,
    })
    await salesChannelRepo.save(salesChannel)

    await storeRepo.update(
      { id: store.id },
      { default_sales_channel_id: salesChannel.id }
    )

    return store
  }

  @OnMedusaEntityEvent.Before.Insert(Invite, { async: true })
  public async addStoreToInvite(
    params: MedusaEventHandlerParams<Invite, 'Insert'>
  ): Promise<EntityEventType<Invite, 'Insert'>> {
    const { event } = params
    const store_id = Object.keys(this.container).includes('loggedInUser')
      ? this.container.loggedInUser.store_id
      : null

    if (!event.entity.store_id && store_id) {
      event.entity.store_id = store_id
    }

    return event
  }

  public async retrieve(config: FindConfig<Store> = {}): Promise<Store> {
    if (
      !Object.keys(this.container).includes('loggedInUser') ||
      !this.container.loggedInUser.store_id
    ) {
      return (await super.retrieve(config as any)) as unknown as Promise<Store>
    }

    config.relations = config.relations || []
    config.relations.push('members')

    const storeRepo = this.manager.getCustomRepository(this.storeRepository)
    const store = await storeRepo.findOne({
      relations: config.relations,
      join: { alias: 'store', innerJoin: { members: 'store.members' } },
      where: (qb) => {
        qb.where('members.id = :memberId', {
          memberId: this.container.loggedInUser.id,
        })
      },
    })

    if (!store) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Store does not exist for current User'
      )
    }

    return store
  }
}
