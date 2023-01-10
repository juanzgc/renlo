import { Module } from 'medusa-extender'
import { SalesChannel } from './sales-channel.entity'
import SalesChannelRepository from './sales-channel.repository'
import SalesChannelService from './sales-channel.service'

@Module({
  imports: [SalesChannel, SalesChannelRepository, SalesChannelService],
})
export class SalesChannelModule {}
