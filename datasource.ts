import { DataSource } from 'typeorm';
import { getModels } from './globtest';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'testextender',
  logging: true,
  entities: getModels(),
  // entities: [
  //   'dist/modules/**/*.entity.js'
  //   // 'node_modules/@medusajs/medusa/dist/models/**/*.js'
  // ],
  migrations: [
    // 'node_modules/@medusajs/medusa/dist/migrations/**/*.js',
    'dist/modules/migration/*.js'
  ],
  subscribers: [],
  synchronize: false
});
