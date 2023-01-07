import { Module } from 'medusa-extender'
import { Order } from './order.entity'
import OrderRepository from './order.repository'
import { OrderService } from './order.service'
import { OrderSubscriber } from './order.subscriber'

@Module({
  imports: [Order, OrderRepository, OrderService, OrderSubscriber],
})
export class OrderModule {}
