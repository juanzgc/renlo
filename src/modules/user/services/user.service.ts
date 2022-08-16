import { EntityManager } from 'typeorm';
import { FindConfig } from '@medusajs/medusa/dist/types/common';
import { EventBusService, User } from '@medusajs/medusa';
import { UserService as MedusaUserService } from '@medusajs/medusa';
import {
  EntityEventType,
  MedusaEventHandlerParams,
  OnMedusaEntityEvent,
  Service
} from 'medusa-extender';
import UserRepository from '../repositories/user.repository';
import UserSubscriber from '../subscribers/user.subscriber';

type InjectedDependencies = {
  manager: EntityManager;
  userRepository: typeof UserRepository;
  eventBusService: EventBusService;
};

@Service({ scope: 'SCOPED', override: MedusaUserService })
export default class UserService extends MedusaUserService {
  private readonly manager: EntityManager;
  private readonly userRepository: typeof UserRepository;
  private readonly eventBus: EventBusService;

  constructor(protected readonly container: InjectedDependencies) {
    super(container);
    this.manager = container.manager;
    this.userRepository = container.userRepository;
    this.eventBus = container.eventBusService;

    // Only works when this is not commented. Middleware doesn't seem to work.
    // UserSubscriber.attachTo(this.manager.connection);
  }

  @OnMedusaEntityEvent.Before.Insert(User, { async: true })
  public async logUserInsert(
    params: MedusaEventHandlerParams<User, 'Insert'>
  ): Promise<EntityEventType<User, 'Insert'>> {
    const { event } = params;
    console.log('inserted user', event);
    return event;
  }

  async retrieve(userId: string, config?: FindConfig<User>): Promise<User> {
    console.log('retrieve');
    return await super.retrieve(userId, config);
  }
}
