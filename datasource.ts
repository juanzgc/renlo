import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'testextender',
  logging: true,
  entities: [
    'dist/modules/**/*.entity.js'
    // 'node_modules/@medusajs/medusa/dist/models/**/*.js'
  ],
  migrations: [
    'dist/modules/migrations/*.js'
    // 'node_modules/@medusajs/medusa/dist/migrations/**/*.js'
  ],
  subscribers: []
});
