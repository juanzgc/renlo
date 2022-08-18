import { EntityManager } from 'typeorm';
import { FindConfig } from '@medusajs/medusa/dist/types/common';
import { MedusaError } from 'medusa-core-utils';
import { EventBusService, User } from '@medusajs/medusa';
import { UserService as MedusaUserService } from '@medusajs/medusa';
import { validateId, buildQuery } from '@medusajs/medusa/dist/utils';
import {
  EntityEventType,
  MedusaEventHandlerParams,
  OnMedusaEntityEvent,
  Service
} from 'medusa-extender';

// Extended
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
    // @TODO: Confirm, bug suspicion, that Subscribers are only working when attached to the Service. (Won't work if only attached in the middleware)
    UserSubscriber.attachTo(this.manager.connection);
  }

  @OnMedusaEntityEvent.Before.Insert(User, { async: true })
  public async logUserInsert(
    params: MedusaEventHandlerParams<User, 'Insert'>
  ): Promise<EntityEventType<User, 'Insert'>> {
    const { event } = params;
    console.log('inserted user', event);
    return event;
  }

  /**
   * Retrieve user and extend to directly query the user being retrieved/
   *
   * @TODO: Return extended User type instead of the Core User type.
   *
   * @param userId
   * @param config
   * @returns
   */
  public async retrieve(
    userId: string,
    config?: FindConfig<User>
  ): Promise<User> {
    const userRepo = this.manager.getCustomRepository(this.userRepository);
    const validatedId = validateId(userId);

    const selector = {
      id: validatedId
    };

    const query = buildQuery(selector, config);

    const user = await userRepo.findOne(query);

    if (!user) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `User with id: ${userId} was not found`
      );
    }

    return user as User;
  }
}
