import { Module } from 'medusa-extender'
import { Order } from './order.entity'
import OrderRepository from './order.repository'
import { OrderService } from './order.service'
@Module({
  imports: [Order, OrderRepository, OrderService],
})
export class OrderModule {}
