import { EntityManager } from 'typeorm'
import EventBusService from '@medusajs/medusa/dist/services/event-bus'
import { FindConfig } from '@medusajs/medusa/dist/types/common'
import {
  AnalyticsConfigService,
  UserService as MedusaUserService,
} from '@medusajs/medusa/dist/services'
import { Service } from 'medusa-extender'
import { User } from './user.entity'
import UserRepository from './user.repository'
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router'
import { buildQuery } from '@medusajs/medusa/dist/utils/build-query'
import { FilterableUserProps } from '@medusajs/medusa/dist/types/user'

type ConstructorParams = {
  manager: EntityManager
  userRepository: typeof UserRepository
  eventBusService: EventBusService
  loggedInUser?: User
  analyticsConfigService: AnalyticsConfigService
  featureFlagRouter: FlagRouter
}

@Service({ override: MedusaUserService })
export default class UserService extends MedusaUserService {
  private readonly manager: EntityManager
  private readonly userRepository: typeof UserRepository
  private readonly eventBus: EventBusService

  constructor(private readonly container: ConstructorParams) {
    super(container)

    this.manager = container.manager
    this.userRepository = container.userRepository
    this.eventBus = container.eventBusService
    this.container = container
  }

  public async addUserToStore(userId: string, storeId: string) {
    await this.atomicPhase_(async (m) => {
      const userRepo = m.getCustomRepository(this.userRepository)
      const query = buildQuery({ id: userId })

      const user = await userRepo.findOne(query)
      if (user) {
        user.store_id = storeId
        await userRepo.save(user)
      }
    })
  }

  async list(selector: FilterableUserProps, config = {}): Promise<User[]> {
    if (
      Object.keys(this.container).includes('loggedInUser') &&
      this.container.loggedInUser.store_id
    ) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    return (await super.list(selector, config)) as unknown as Promise<User[]>
  }

  async retrieve(userId: string, config: FindConfig<User> = {}): Promise<User> {
    return (await super.retrieve(
      userId,
      config as any
    )) as unknown as Promise<User>
  }
}
