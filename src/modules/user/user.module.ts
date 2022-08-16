import { Module } from 'medusa-extender';

import { AttachUserSubscriberMiddleware } from './middlewares/userSubscriber.middleware';
import { User } from './entities/user.entity';
import UserRepository from './repositories/user.repository';
import UserService from './services/user.service';

@Module({
  imports: [User, UserService, UserRepository]
})
export class UserModule {}
