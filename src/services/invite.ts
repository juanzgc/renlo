import { ConfigModule, EventBusService, Selector } from '@medusajs/medusa'
import MedusaInviteService from '@medusajs/medusa/dist/services/invite'
import { ListInvite } from '@medusajs/medusa/dist/types/invites'
import { Lifetime } from 'awilix'
import { EntityManager } from 'typeorm'
import { Invite } from '../models/invite'
import { User } from '../models/user'
import InviteRepository from '../repositories/invite'
import UserRepository from '../repositories/user'
import { isLoggedInUser } from '../utils'
import UserService from './user'

interface Params {
  manager: EntityManager
  userService: UserService
  userRepository: typeof UserRepository
  inviteRepository: typeof InviteRepository
  eventBusService: EventBusService
  configModule: ConfigModule
  loggedInUser?: User | null
}

class InviteService extends MedusaInviteService {
  static LIFE_TIME = Lifetime.SCOPED

  protected readonly inviteRepository: typeof InviteRepository

  constructor(private readonly container: Params, configModule: ConfigModule) {
    // @TODO Config Module is not being set
    super(container, container.configModule)
    this.inviteRepository = container.inviteRepository
  }

  async list(selector: Selector<Invite>, config = {}): Promise<ListInvite[]> {
    if (isLoggedInUser(this.container)) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    return super.list(selector, config)
  }

  async retrieve(invite_id: string): Promise<Invite | null> {
    const inviteRepo = this.activeManager_.withRepository(this.inviteRepository)
    return await inviteRepo.findOne({ where: { id: invite_id } })
  }

  async retrieveByEmail(email: string): Promise<Invite | null> {
    const inviteRepo = this.activeManager_.withRepository(this.inviteRepository)
    return await inviteRepo.findOne({
      where: { user_email: email },
    })
  }
}

export default InviteService
