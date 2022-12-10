import { Module } from 'medusa-extender';
import { Product } from './product.entity3';

@Module({
  imports: [Product]
})
export class ProductModule {}
