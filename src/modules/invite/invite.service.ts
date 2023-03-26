import { EntityManager } from 'typeorm'
import { Service } from 'medusa-extender'
import { buildQuery, EventBusService } from '@medusajs/medusa'
import { ConfigModule } from '@medusajs/medusa/dist/types/global'
import { default as MedusaInviteService } from '@medusajs/medusa/dist/services/invite'
import { Invite } from './invite.entity'
import InviteRepository from './invite.repository'
import { User } from '../user/user.entity'
import UserRepository from '../user/user.repository'
import UserService from '../user/user.service'
import { FindConfig, QuerySelector } from '@medusajs/medusa/dist/types/common'

type InjectedDependencies = {
  manager: EntityManager
  userService: UserService
  userRepository: typeof UserRepository
  eventBusService: EventBusService
  inviteRepository: typeof InviteRepository
  loggedInUser?: User
}

type ListInvite = Omit<Invite, 'beforeInsert'> & {
  token: string
}

@Service({ scope: 'SCOPED', override: MedusaInviteService })
export class InviteService extends MedusaInviteService {
  static readonly resolutionKey = 'inviteService'

  private readonly manager: EntityManager
  private readonly container: InjectedDependencies
  private readonly inviteRepository: typeof InviteRepository

  constructor(container: InjectedDependencies, configModule: ConfigModule) {
    super(container, configModule)

    this.manager = container.manager
    this.container = container
    this.inviteRepository = container.inviteRepository
  }

  async list(
    selector: QuerySelector<Invite>,
    config: FindConfig<Invite> = {}
  ): Promise<ListInvite[]> {
    if (
      Object.keys(this.container).includes('loggedInUser') &&
      this.container.loggedInUser.store_id
    ) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    return super.list(selector, config as any) as unknown as Promise<
      ListInvite[]
    >
  }

  async retrieve(
    inviteId: string,
    config: FindConfig<Invite> = {}
  ): Promise<Invite | null> {
    return await this.atomicPhase_(async (m) => {
      const inviteRepo: InviteRepository = m.getCustomRepository(
        this.inviteRepository
      )

      const query = buildQuery({ id: inviteId }, config)
      return await inviteRepo.findOne(query)
    })
  }
}
