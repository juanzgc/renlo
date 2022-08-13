import { StoreService as MedusaStoreService } from '@medusajs/medusa';
import { EntityManager } from 'typeorm';
import { CurrencyRepository } from '@medusajs/medusa/dist/repositories/currency';
import {
  EntityEventType,
  Service,
  MedusaEventHandlerParams,
  OnMedusaEntityEvent
} from 'medusa-extender';
import { EventBusService } from '@medusajs/medusa';
import StoreRepository from '../repositories/store.repository';
import { Store } from '../entities/store.entity';
import { User } from '../../user/entities/user.entity';
import { FindConfig } from '@medusajs/medusa/dist/types/common';
import { MedusaError } from 'medusa-core-utils';

type InjectedDependencies = {
  loggedInUser?: User;
  manager: EntityManager;
  storeRepository: typeof StoreRepository;
  currencyRepository: typeof CurrencyRepository;
  eventBusService: EventBusService;
};

@Service({ override: MedusaStoreService, scope: 'SCOPED' })
export default class StoreService extends MedusaStoreService {
  private readonly manager: EntityManager;
  private readonly storeRepository: typeof StoreRepository;

  constructor(protected readonly container: InjectedDependencies) {
    super(container);

    this.manager = container.manager;
    this.storeRepository = container.storeRepository;
  }

  @OnMedusaEntityEvent.Before.Insert(User, { async: true })
  public async createStoreForNewUser(
    params: MedusaEventHandlerParams<User, 'Insert'>
  ): Promise<EntityEventType<User, 'Insert'>> {
    const { event } = params;
    let store_id = Object.keys(this.container).includes('loggedInUser')
      ? this.container.loggedInUser.store_id
      : null;

    if (!store_id) {
      // I've added an `as StoreService` to show that it is now as the new StoreService
      const createdStore = await (
        this.withTransaction(event.manager) as StoreService
      ).createForUser(event.entity);
      if (!!createdStore) {
        store_id = createdStore.id;
      }
    }
    event.entity.store_id = store_id;
    return event;
  }

  /**
   * Create a store for a particular user. It's mainly used from the BeforeInsert event to create a store for a new user.
   * @param user
   */
  public async createForUser(user: User): Promise<Store | void> {
    if (user.store_id) {
      return;
    }

    const storeRepo = this.manager.getCustomRepository(this.storeRepository);
    const store = storeRepo.create() as Store;
    return storeRepo.save(store);
  }

  /**
   * Return the store that belongs to the authenticated user.
   * @param relations
   */
  async retrieve(config: FindConfig<Store> = {}) {
    if (!Object.keys(this.container).includes('loggedInUser')) {
      // i've had to add `as any` in order for it to be okay
      return super.retrieve(config as any);
    }

    const storeRepo = this.manager.getCustomRepository(this.storeRepository);
    const store = await storeRepo.findOne({
      ...config,
      join: { alias: 'store', innerJoin: { users: 'store.tenant_members' } },
      where: (qb) => {
        qb.where('users.id = :userId', {
          userId: this.container.loggedInUser.id
        });
      }
    });

    if (!store) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Store does not exist'
      );
    }
    return store;
  }
}
