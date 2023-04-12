import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'
import {
  attachSubscriber,
  eventEmitter,
  OnMedusaEntityEvent,
} from '../core/event-emitter'
import { User } from '../models/user'

@EventSubscriber()
export class UserSubscriberORM implements EntitySubscriberInterface<User> {
  static attach() {
    attachSubscriber(UserSubscriberORM)
  }

  listenTo(): typeof User {
    return User
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    return await eventEmitter.emitAsync(
      OnMedusaEntityEvent.Before.InsertEvent(User),
      {
        event,
        transactionalEntityManager: event.manager,
      }
    )
  }
}

export default UserSubscriberORM
