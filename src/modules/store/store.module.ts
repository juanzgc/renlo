import { Module } from 'medusa-extender';

import { Store } from './entities/store.entity';
@Module({
  imports: [Store]
})
export class StoreModule {}
