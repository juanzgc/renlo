import { Repository as MedusaRepository } from 'medusa-extender'
import { EntityRepository } from 'typeorm'
import { ProductRepository as MedusaProductRepository } from '@medusajs/medusa/dist/repositories/product'
import { Product } from './product.entity'

@MedusaRepository({ override: MedusaProductRepository })
@EntityRepository(Product)
export default class ProductRepository extends MedusaProductRepository {}
