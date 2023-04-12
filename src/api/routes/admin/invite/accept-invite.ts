import { Request, Response } from 'express'
import { validator } from '@medusajs/medusa/dist/utils/validator'
import UserService from '../../../../services/user'
import { AdminPostInvitesInviteAcceptReq } from '@medusajs/medusa'
import InviteService from '../../../../services/invite'
import { EntityManager } from 'typeorm'
import { MedusaError } from 'medusa-core-utils'

export default async (req: Request, res: Response) => {
  const validated = await validator(AdminPostInvitesInviteAcceptReq, req.body)

  const inviteService: InviteService = req.scope.resolve('inviteService')
  const manager: EntityManager = req.scope.resolve('manager')

  await manager.transaction(async (m) => {
    let decoded
    try {
      decoded = inviteService.withTransaction(m).verifyToken(validated.token)
    } catch (err) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Token is invalid')
    }

    const invite = await inviteService
      .withTransaction(m)
      .retrieve(decoded.invite_id)

    const store_id = invite ? invite.store_id : null

    const user = await inviteService
      .withTransaction(m)
      .accept(validated.token, validated.user)

    if (store_id) {
      const userService: UserService = req.scope.resolve('userService')

      await userService.withTransaction(m).addUserToStore(user.id, store_id)
    }

    res.sendStatus(200)
  })
}
