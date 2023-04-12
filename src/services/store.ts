import { Lifetime } from 'awilix'
import {
  EventBusService,
  FindConfig,
  StoreService as MedusaStoreService,
} from '@medusajs/medusa'
import { EntityManager } from 'typeorm'
import StoreRepository from '../repositories/store'
import CurrencyRepository from '@medusajs/medusa/dist/repositories/currency'
import SalesChannelRepository from '../repositories/sales-channel'
import { User } from '../models/user'
import { Invite } from '../models/invite'
import {
  EntityEventType,
  MedusaEventHandlerParams,
  OnMedusaEntityEvent,
} from '../core/event-emitter'
import { Store } from '../models/store'
import { MedusaError } from 'medusa-core-utils'
import { isLoggedInUser } from '../utils'
import InviteService from './invite'

interface Params {
  manager: EntityManager
  storeRepository: typeof StoreRepository
  currencyRepository: typeof CurrencyRepository
  eventBusService: EventBusService
  salesChannelRepository: typeof SalesChannelRepository
  inviteService: InviteService
  loggedInUser?: User | null
}

class StoreService extends MedusaStoreService {
  static LIFE_TIME = Lifetime.SCOPED

  protected readonly storeRepository: typeof StoreRepository
  protected readonly currencyRepository: typeof CurrencyRepository
  protected readonly salesChannelRepository: typeof SalesChannelRepository
  protected readonly inviteService: InviteService

  constructor(private readonly container: Params) {
    super(container)

    this.storeRepository = container.storeRepository
    this.currencyRepository = container.currencyRepository
    this.salesChannelRepository = container.salesChannelRepository
    this.inviteService = container.inviteService
  }

  /**
   * Default store_id for a new User to the existing user's. Otherwise create a new store_id
   *
   * Subscriber Decorator: OnMedusaEntityEvent
   */
  @OnMedusaEntityEvent.Before.Insert(User, { async: true })
  public async createStoreForNewUser(
    params: MedusaEventHandlerParams<User, 'Insert'>
  ): Promise<EntityEventType<User, 'Insert'>> {
    const { event } = params

    console.log('Before Insert: User')
    let storeId = null

    if (!isLoggedInUser(this.container)) {
      // Create Store for new user, unless the User was invited, in which case use the invited store_id
      const invite = await this.inviteService
        .withTransaction(event.manager)
        .retrieveByEmail(event.entity.email)

      if (invite && invite.store_id) {
        console.log('invite and store_id exist')
        storeId = invite.store_id
      } else {
        console.log('invite with store_id DNE')
        // If store_id DNE on Invite, create store for user
        const createdStore = await this.withTransaction(
          event.manager
        ).createForUser(event.entity)
        if (!!createdStore) {
          storeId = createdStore.id
        }
      }
    } else {
      storeId = this.container.loggedInUser.store_id
    }

    event.entity.store_id = storeId
    return event
  }

  @OnMedusaEntityEvent.Before.Insert(Invite, { async: true })
  public async addStoreToInvite(
    params: MedusaEventHandlerParams<Invite, 'Insert'>
  ): Promise<EntityEventType<Invite, 'Insert'>> {
    const { event } = params

    let store_id = null
    if (isLoggedInUser(this.container)) {
      store_id = this.container.loggedInUser.store_id
    }

    console.log('Before Invite, store_id', store_id)
    if (!event.entity.store_id && store_id) {
      event.entity.store_id = store_id
    }

    return event
  }

  public async createForUser(user: User): Promise<Store | void> {
    console.log('Create store for User')
    if (user.store_id) {
      return
    }

    const storeRepo = this.activeManager_.withRepository(this.storeRepository)
    const currencyRepo = this.activeManager_.withRepository(
      this.currencyRepository
    )

    const store = storeRepo.create() as Store

    // Add default currency (USD) to store currencies
    const usd = await currencyRepo.find({
      where: {
        code: 'usd',
      },
      take: 1,
    })

    if (usd) {
      store.currencies = usd
    }

    await storeRepo.save(store)

    const salesChannelRepo = this.manager_.withRepository(
      this.salesChannelRepository
    )
    const salesChannel = salesChannelRepo.create({
      description: `Created by ${user.email}`,
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

  public async create(): Promise<Store> {
    // @TODO, remove once store.createDefault has been added.
    console.log('CREATING STORE')
    return super.create()
  }

  public async retrieve(config: FindConfig<Store> = {}): Promise<Store> {
    // @TODO Remove once store.createDefault has been added. Possible data leak.
    if (!isLoggedInUser(this.container)) {
      return super.retrieve(config)
    }

    config.relations = config.relations || []
    config.relations.push('admins')

    const storeRepo = this.activeManager_.withRepository(this.storeRepository)
    const store = await storeRepo.findOne({
      relations: config.relations,
      where: {
        admins: {
          id: this.container.loggedInUser.id,
        },
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

export default StoreService
