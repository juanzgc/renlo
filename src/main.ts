import 'reflect-metadata';
import express = require('express');
/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('../medusa-config');
import { Medusa } from 'medusa-extender';
import { resolve } from 'path';
import { MigrationModule } from './modules/migration.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';

async function bootstrap() {
  const expressInstance = express();

  await new Medusa(resolve(__dirname, '..'), expressInstance).load([
    // ProductModule,
    // UserModule,
    MigrationModule
  ]);

  expressInstance.listen(config.serverConfig.port, () => {
    console.info(
      'Server successfully started on port ' + config.serverConfig.port
    );
  });
}

bootstrap();
