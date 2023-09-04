import { Repository as MedusaRepository, Utils } from 'medusa-extender'

import { EntityRepository } from 'typeorm'
import { InviteRepository as MedusaInviteRepository } from '@medusajs/medusa/dist/repositories/invite'
import { Invite } from './invite.entity'

@MedusaRepository({ override: MedusaInviteRepository })
@EntityRepository(Invite)
export default class InviteRepository extends Utils.repositoryMixin<
  Invite,
  MedusaInviteRepository
>(MedusaInviteRepository) {}
