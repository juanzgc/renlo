import { Module } from 'medusa-extender'
import { Invite } from './invite.entity'
import InviteRepository from './invite.repository'
import { InviteService } from './invite.service'
import { AttachInviteSubscriberMiddleware } from './inviteSubscriber.middleware'
@Module({
  imports: [
    Invite,
    InviteRepository,
    InviteService,
    AttachInviteSubscriberMiddleware,
  ],
})
export class InviteModule {}
