import { Module } from 'medusa-extender';
import StoreRepository from './repositories/store.repository';
import { Store } from './entities/store.entity';
import StoreService from './services/store.service';

@Module({
  imports: [Store, StoreRepository, StoreService]
})
export class StoreModule {}
