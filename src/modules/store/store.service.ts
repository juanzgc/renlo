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
import { buildQuery } from '@medusajs/medusa/dist/utils/build-query'

interface ConstructorParams {
  loggedInUser?: User
  manager: EntityManager
  storeRepository: typeof StoreRepository
  currencyRepository: typeof CurrencyRepository
  eventBusService: EventBusService
}

@Service({ override: MedusaStoreService, scope: 'SCOPED' })
export default class StoreService extends MedusaStoreService {
  private readonly manager: EntityManager
  private readonly storeRepository: typeof StoreRepository

  constructor(private readonly container: ConstructorParams) {
    super(container)
    this.manager = container.manager
    this.storeRepository = container.storeRepository
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
    const store = storeRepo.create() as Store
    return storeRepo.save(store)
  }

  public async retrieve(config: FindConfig<Store> = {}): Promise<Store> {
    if (!Object.keys(this.container).includes('loggedInUser')) {
      return (await super.retrieve(config as any)) as unknown as Promise<Store>
    }

    const query = buildQuery({}, config)
    const storeRepo = this.manager.getCustomRepository(this.storeRepository)
    const store = await storeRepo.findOne({
      ...config,
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
