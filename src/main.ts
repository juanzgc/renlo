import express = require('express')
/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('../medusa-config')
import { Medusa } from 'medusa-extender'
import { resolve } from 'path'
import { InviteModule } from './modules/invite/invite.module'
import { MigrationModule } from './modules/migration/migration.module'
import { OrderModule } from './modules/order/order.module'
import { ProductModule } from './modules/product/product.module'
import { SalesChannelModule } from './modules/sales-channel/sales-channel.module'
import { StoreModule } from './modules/store/store.module'
import { UserModule } from './modules/user/user.module'

async function bootstrap() {
  const expressInstance = express()

  await new Medusa(resolve(__dirname, '..'), expressInstance).load([
    InviteModule,
    MigrationModule,
    OrderModule,
    ProductModule,
    SalesChannelModule,
    StoreModule,
    UserModule,
  ])

  expressInstance.listen(config.serverConfig.port, () => {
    console.info(
      'Server successfully started on port ' + config.serverConfig.port
    )
  })
}

bootstrap()
