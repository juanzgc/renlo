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
import { SalesChannel } from '../models/sales-channel'

@EventSubscriber()
export class SalesChannelSubscriberORM
  implements EntitySubscriberInterface<SalesChannel>
{
  static attach() {
    attachSubscriber(SalesChannelSubscriberORM)
  }

  listenTo(): typeof SalesChannel {
    return SalesChannel
  }

  async beforeInsert(event: InsertEvent<SalesChannel>): Promise<void> {
    return await eventEmitter.emitAsync(
      OnMedusaEntityEvent.Before.InsertEvent(SalesChannel),
      {
        event,
        transactionalEntityManager: event.manager,
      }
    )
  }
}

export default SalesChannelSubscriberORM
