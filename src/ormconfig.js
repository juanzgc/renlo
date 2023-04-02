import { DataSource } from 'typeorm'

export const connectionSource = new DataSource({
  type: 'postgres',
  url: 'postgres://postgres:postgres@localhost:5432/renlo',
  synchronize: false,
  entities: [
    'dist/models/*.js',
  ],
  migrations: [
    'dist/migrations/*.js',
  ],
})
