const { DataSource } = require("typeorm")

const connectionSource = new DataSource({
  type: 'postgres',
  url: 'postgres://postgres:postgres@localhost:5432/renlo',
  synchronize: false,
  entities: [
    'dist/models/*.js',
    'node_modules/@medusajs/medusa/dist/models/!(*.index.js)',

  ],
  migrations: [
    'dist/migrations/*.js',
    'node_modules/@medusajs/medusa/dist/migrations/*.js',
  ]
})

module.exports = {
  datasource: connectionSource
}