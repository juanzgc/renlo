import { Lifetime } from 'awilix'
import { EntityManager } from 'typeorm'
import {
  OrderService as MedusaOrderService,
  CustomerService,
  PaymentProviderService,
  ShippingOptionService,
  ShippingProfileService,
  DiscountService,
  FulfillmentProviderService,
  FulfillmentService,
  LineItemService,
  TotalsService,
  NewTotalsService,
  TaxProviderService,
  RegionService,
  CartService,
  GiftCardService,
  DraftOrderService,
  EventBusService,
  ProductVariantInventoryService,
  FindConfig,
  Order,
  QuerySelector,
} from '@medusajs/medusa'
import { IInventoryService } from '@medusajs/types'
import OrderRepository from '../repositories/order'
import AddressRepository from '@medusajs/medusa/dist/repositories/address'
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router'
import { User } from '../models/user'
import { isLoggedInUser } from '../utils'

interface Params {
  manager: EntityManager
  orderRepository: typeof OrderRepository
  customerService: CustomerService
  paymentProviderService: PaymentProviderService
  shippingOptionService: ShippingOptionService
  shippingProfileService: ShippingProfileService
  discountService: DiscountService
  fulfillmentProviderService: FulfillmentProviderService
  fulfillmentService: FulfillmentService
  lineItemService: LineItemService
  totalsService: TotalsService
  newTotalsService: NewTotalsService
  taxProviderService: TaxProviderService
  regionService: RegionService
  cartService: CartService
  addressRepository: typeof AddressRepository
  giftCardService: GiftCardService
  draftOrderService: DraftOrderService
  inventoryService: IInventoryService
  eventBusService: EventBusService
  featureFlagRouter: FlagRouter
  productVariantInventoryService: ProductVariantInventoryService
  loggedInUser?: User | null
}

class OrderService extends MedusaOrderService {
  static LIFE_TIME = Lifetime.SCOPED

  constructor(private readonly container: Params) {
    super(container)
  }

  async listAndCount(
    selector: QuerySelector<Order>,
    config: FindConfig<Order> = {
      skip: 0,
      take: 50,
      order: { created_at: 'DESC' },
    }
  ): Promise<[Order[], number]> {
    if (isLoggedInUser(this.container)) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    config.select = config.select || []
    config.select.push('store_id')

    return super.listAndCount(selector, config)
  }
}

export default OrderService
