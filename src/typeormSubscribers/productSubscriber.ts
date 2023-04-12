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
import { Product } from '../models/product'

@EventSubscriber()
export class ProductSubscriberORM
  implements EntitySubscriberInterface<Product>
{
  static attach() {
    attachSubscriber(ProductSubscriberORM)
  }

  listenTo(): typeof Product {
    return Product
  }

  async beforeInsert(event: InsertEvent<Product>): Promise<void> {
    return await eventEmitter.emitAsync(
      OnMedusaEntityEvent.Before.InsertEvent(Product),
      {
        event,
        transactionalEntityManager: event.manager,
      }
    )
  }
}

export default ProductSubscriberORM
