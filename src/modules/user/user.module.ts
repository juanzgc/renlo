import { AttachUserSubscriberMiddleware } from './userSubscriber.middleware'
import { LoggedInUserMiddleware } from './loggedInUser.middleware'
import { Module } from 'medusa-extender'
import { User } from './user.entity'
import UserRepository from './user.repository'
import { UserRouter } from './user.router'
import UserService from './user.service'

@Module({
  imports: [
    User,
    UserService,
    UserRepository,
    UserRouter,
    LoggedInUserMiddleware,
    AttachUserSubscriberMiddleware,
  ],
})
export class UserModule {}
