import { EntityManager } from 'typeorm';
import { FindConfig } from '@medusajs/medusa/dist/types/common';
import { EventBusService } from '@medusajs/medusa';
import { MedusaError } from 'medusa-core-utils';
import { UserService as MedusaUserService } from '@medusajs/medusa';
import { Service } from 'medusa-extender';
import { User } from '../entities/user.entity';
import UserRepository from '../repositories/user.repository';
import { validateId, buildQuery } from '@medusajs/medusa/dist/utils';

type InjectedDependencies = {
  manager: EntityManager;
  userRepository: typeof UserRepository;
  eventBusService: EventBusService;
  loggedInUser?: User;
};

@Service({ scope: 'SCOPED', override: MedusaUserService })
export default class UserService extends MedusaUserService {
  private readonly manager: EntityManager;
  private readonly userRepository: typeof UserRepository;
  private readonly eventBus: EventBusService;
  protected readonly container: InjectedDependencies;

  constructor(container) {
    super(container);
    this.manager = container.manager;
    this.userRepository = container.userRepository;
    this.eventBus = container.eventBusService;
    this.container = container;
  }

  public async retrieve(
    userId: string,
    config?: FindConfig<User>
  ): Promise<User> {
    const userRepo = this.manager.getCustomRepository(this.userRepository);
    const validatedId = validateId(userId);

    let selector = {
      id: validatedId
    };

    if (
      Object.keys(this.container).includes('loggedInUser') &&
      this.container.loggedInUser.store_id
    ) {
      selector['store_id'] = this.container.loggedInUser.store_id;
    }

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
