import { Module } from 'medusa-extender';
import { Product } from './product.entity';

@Module({
  imports: [Product]
})
export class ProductModule {}
