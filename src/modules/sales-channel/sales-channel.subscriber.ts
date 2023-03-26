import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'
import {
  Utils as MedusaUtils,
  OnMedusaEntityEvent,
  eventEmitter,
} from 'medusa-extender'

import { SalesChannel } from './sales-channel.entity'

@EventSubscriber()
export default class SalesChannelSubscriber
  implements EntitySubscriberInterface<SalesChannel>
{
  static attachTo(connection: Connection): void {
    MedusaUtils.attachOrReplaceEntitySubscriber(
      connection,
      SalesChannelSubscriber
    )
  }

  public listenTo(): typeof SalesChannel {
    return SalesChannel
  }

  /**
   * Relay the event to the handlers.
   * @param event Event to pass to the event handler
   */
  public async beforeInsert(event: InsertEvent<SalesChannel>): Promise<void> {
    return await eventEmitter.emitAsync(
      OnMedusaEntityEvent.Before.InsertEvent(SalesChannel),
      {
        event,
        transactionalEntityManager: event.manager,
      }
    )
  }
}
