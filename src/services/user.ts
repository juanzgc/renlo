import { Lifetime } from 'awilix'
import { EntityManager } from 'typeorm'
import {
  UserService as MedusaUserService,
  EventBusService,
  AnalyticsConfigService,
  FindConfig,
  buildQuery,
} from '@medusajs/medusa'
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router'
import { UserRepository } from '../repositories/user'
import { User } from '../models/user'
import { FilterableUserProps } from '@medusajs/medusa/dist/types/user'
import { isLoggedInUser } from '../utils'

interface Params {
  userRepository: typeof UserRepository
  analyticsConfigService: AnalyticsConfigService
  eventBusService: EventBusService
  manager: EntityManager
  featureFlagRouter: FlagRouter
  loggedInUser: User | null
}

class UserService extends MedusaUserService {
  static LIFE_TIME = Lifetime.SCOPED

  private readonly userRepository: typeof UserRepository
  constructor(private readonly container: Params) {
    super(container)
  }

  public async addUserToStore(userId: string, storeId: string) {
    await this.atomicPhase_(async (m) => {
      const userRepo = m.withRepository(this.userRepository)
      const query = buildQuery({ id: userId })

      const user = await userRepo.findOne(query)
      if (user) {
        user.store_id = storeId
        await userRepo.save(user)
      }
    })
  }

  async list(
    selector: FilterableUserProps,
    config: FindConfig<User> = {}
  ): Promise<User[]> {
    if (isLoggedInUser(this.container)) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    return super.list(selector, config)
  }
}

export default UserService
