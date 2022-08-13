import { Module } from 'medusa-extender';

import { AttachUserSubscriberMiddleware } from './middlewares/userSubscriber.middleware';
import { LoggedInUserMiddleware } from './middlewares/loggedInUser.middleware';
import { User } from './entities/user.entity';
import UserRepository from './repositories/user.repository';
import { UserRouter } from './routers/user.router';
import UserService from './services/user.service';

@Module({
  imports: [
    User,
    UserService,
    UserRepository,
    UserRouter,
    LoggedInUserMiddleware,
    AttachUserSubscriberMiddleware
  ]
})
export class UserModule {}
