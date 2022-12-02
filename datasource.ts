import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  database: 'testextender',
  logging: true,
  entities: ['dist/modules/**/*.entity.js'],
  migrations: ['dist/modules/migrations/*.js'],
  subscribers: []
});
