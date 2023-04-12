import { Lifetime } from 'awilix'
import { EntityManager } from 'typeorm'
import {
  EventBusService,
  ProductService as MedusaProductService,
  ProductVariantService,
  SearchService,
} from '@medusajs/medusa'
import ProductOptionRepository from '@medusajs/medusa/dist/repositories/product-option'
import ProductRepository from '../repositories/product'
import ProductVariantRepository from '@medusajs/medusa/dist/repositories/product-variant'
import ProductTypeRepository from '@medusajs/medusa/dist/repositories/product-type'
import ProductTagRepository from '@medusajs/medusa/dist/repositories/product-tag'
import ImageRepository from '@medusajs/medusa/dist/repositories/image'
import ProductCategoryRepository from '@medusajs/medusa/dist/repositories/product-category'
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router'
import { Selector } from '@medusajs/medusa/dist/types/common'
import {
  EntityEventType,
  MedusaEventHandlerParams,
  OnMedusaEntityEvent,
} from '../core/event-emitter'
import { Product } from '../models/product'
import { User } from '../models/user'
import {
  FindProductConfig,
  ProductSelector,
} from '@medusajs/medusa/dist/types/product'
import StoreService from './store'
import { MedusaError } from 'medusa-core-utils'
import { isLoggedInUser } from '../utils'

interface Params {
  manager: EntityManager
  productOptionRepository: typeof ProductOptionRepository
  productRepository: typeof ProductRepository
  productVariantRepository: typeof ProductVariantRepository
  productTypeRepository: typeof ProductTypeRepository
  productTagRepository: typeof ProductTagRepository
  imageRepository: typeof ImageRepository
  productCategoryRepository: typeof ProductCategoryRepository
  productVariantService: ProductVariantService
  searchService: SearchService
  eventBusService: EventBusService
  featureFlagRouter: FlagRouter
  storeService: StoreService
  loggedInUser?: User | null
}

class ProductService extends MedusaProductService {
  static LIFE_TIME = Lifetime.SCOPED

  protected readonly storeService: StoreService

  constructor(private readonly container: Params) {
    super(container)
    this.storeService = container.storeService
  }

  @OnMedusaEntityEvent.Before.Insert(Product, { async: true })
  public async attachStoreToProduct(
    params: MedusaEventHandlerParams<Product, 'Insert'>
  ): Promise<EntityEventType<Product, 'Insert'>> {
    const { event } = params

    const store = await this.container.storeService
      .withTransaction(event.manager)
      .retrieve()

    if (!store) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Store does not exist for current admin'
      )
    }

    event.entity.store_id = store.id
    return event
  }

  async listAndCount(
    selector: ProductSelector,
    config: FindProductConfig = {
      relations: [],
      skip: 0,
      take: 20,
      include_discount_prices: false,
    }
  ): Promise<[Product[], number]> {
    if (isLoggedInUser(this.container)) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    config.select = config.select || []
    config.select.push('store_id')

    return super.listAndCount(selector, config)
  }

  async retrieve_(
    selector: Selector<Product>,
    config: FindProductConfig = {
      include_discount_prices: false, // TODO: this seams to be unused from the repository
    }
  ): Promise<Product> {
    if (isLoggedInUser(this.container)) {
      selector['store_id'] = this.container.loggedInUser.store_id
    }

    config.select = config.select || []
    config.select.push('store_id')

    return super.retrieve_(selector, config)
  }
}

export default ProductService
