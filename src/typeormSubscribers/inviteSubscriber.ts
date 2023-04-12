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
import { Invite } from '../models/invite'

@EventSubscriber()
export class InviteSubscriberORM implements EntitySubscriberInterface<Invite> {
  static attach() {
    attachSubscriber(InviteSubscriberORM)
  }

  listenTo(): typeof Invite {
    return Invite
  }

  async beforeInsert(event: InsertEvent<Invite>): Promise<void> {
    return await eventEmitter.emitAsync(
      OnMedusaEntityEvent.Before.InsertEvent(Invite),
      {
        event,
        transactionalEntityManager: event.manager,
      }
    )
  }
}

export default InviteSubscriberORM
