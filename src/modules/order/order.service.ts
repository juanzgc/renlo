import { EntityManager } from 'typeorm'
import { OrderService as MedusaOrderService } from '@medusajs/medusa'
import OrderRepository from './order.repository'
import { Service } from 'medusa-extender'
import { User } from '../user/user.entity'
import { Order } from './order.entity'
import {
  FindConfig,
  QuerySelector,
  Selector,
} from '@medusajs/medusa/dist/types/common'

type InjectedDependencies = {
  manager: EntityManager
  orderRepository: typeof OrderRepository
  customerService: any
  paymentProviderService: any
  shippingOptionService: any
  shippingProfileService: any
  discountService: any
  fulfillmentProviderService: any
  fulfillmentService: any
  lineItemService: any
  totalsService: any
  regionService: any
  cartService: any
  addressRepository: any
  giftCardService: any
  draftOrderService: any
  inventoryService: any
  eventBusService: any
  newTotalsService: any
  taxProviderService: any
  featureFlagRouter: any
  loggedInUser?: User
}

@Service({ scope: 'SCOPED', override: MedusaOrderService })
export class OrderService extends MedusaOrderService {
  private readonly manager: EntityManager
  private readonly container: InjectedDependencies

  constructor(container: InjectedDependencies) {
    super(container)

    this.manager = container.manager
    this.container = container
  }

  async listAndCount(
    selector: QuerySelector<Order>,
    config?: FindConfig<Order>
  ): Promise<[Order[], number]> {
    if (
      Object.keys(this.container).includes('loggedInUser') &&
      this.container.loggedInUser.store_id
    ) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    return super.listAndCount(selector, config as any) as unknown as Promise<
      [Order[], number]
    >
  }

  async retrieve(orderId: string, config?: FindConfig<Order>): Promise<Order> {
    return super.retrieve(orderId, config as any) as Promise<Order>
  }
}
