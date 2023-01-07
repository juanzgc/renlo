import {
  EntityEventType,
  MedusaEventHandlerParams,
  OnMedusaEntityEvent,
  Service,
} from 'medusa-extender'

import { EntityManager } from 'typeorm'
import { ProductService as MedusaProductService } from '@medusajs/medusa/dist/services'
import { Product } from './product.entity'
import { User } from '../user/user.entity'
import UserService from '../user/user.service'
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router'
import { Selector } from '@medusajs/medusa/dist/types/common'
import {
  FilterableProductProps,
  FindProductConfig,
} from '@medusajs/medusa/dist/types/product'

type ConstructorParams = {
  manager: any
  loggedInUser?: User
  productRepository: any
  productVariantRepository: any
  productOptionRepository: any
  eventBusService: any
  productVariantService: any
  productCollectionService: any
  productTypeRepository: any
  productTagRepository: any
  imageRepository: any
  searchService: any
  userService: UserService
  cartRepository: any
  priceSelectionStrategy: any
  featureFlagRouter: FlagRouter
}

@Service({ scope: 'SCOPED', override: MedusaProductService })
export class ProductService extends MedusaProductService {
  private readonly manager: EntityManager

  constructor(private readonly container: ConstructorParams) {
    super(container)
    this.manager = container.manager
  }

  @OnMedusaEntityEvent.Before.Insert(Product, { async: true })
  public async attachStoreToProduct(
    params: MedusaEventHandlerParams<Product, 'Insert'>
  ): Promise<EntityEventType<Product, 'Insert'>> {
    const { event } = params
    const loggedInUser = this.container.loggedInUser
    event.entity.store_id = loggedInUser.store_id
    return event
  }

  protected prepareListQuery_(
    selector: FilterableProductProps | Selector<Product>,
    config: FindProductConfig
  ) {
    const loggedInUser = Object.keys(this.container).includes('loggedInUser')
      ? this.container.loggedInUser
      : null

    if (loggedInUser) {
      selector['store_id'] = loggedInUser.store_id
    }

    return super.prepareListQuery_(selector, config)
  }

  async retrieve(
    productId: string,
    config?: FindProductConfig
  ): Promise<Product> {
    return super.retrieve(productId, config) as Promise<Product>
  }
}
