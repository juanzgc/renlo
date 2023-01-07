import AttachProductSubscribersMiddleware from './product.middleware'
import { Module } from 'medusa-extender'
import { Product } from './product.entity'
import ProductRepository from './product.repository'
import { ProductService } from './product.service'

@Module({
  imports: [
    Product,
    ProductRepository,
    ProductService,
    AttachProductSubscribersMiddleware,
  ],
})
export class ProductModule {}
