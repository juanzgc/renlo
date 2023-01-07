import AttachProductSubscribersMiddleware from './product.middleware'
import { Module } from 'medusa-extender'
import { Product } from './product.entity'
import ProductRepository from './product.repository'
import { ProductService } from './product.service'
import ProductSubscriber from './product.subscriber'

@Module({
  imports: [
    Product,
    ProductRepository,
    ProductService,
    ProductSubscriber,
    AttachProductSubscribersMiddleware,
  ],
})
export class ProductModule {}
