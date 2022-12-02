import { Module } from 'medusa-extender';

import { User } from './user.entity';

@Module({
  imports: [User]
})
export class UserModule {}
