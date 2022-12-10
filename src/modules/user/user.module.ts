import { Module } from 'medusa-extender';

import { User } from './user.entity3';

@Module({
  imports: [User]
})
export class UserModule {}
