const dotenv = require('dotenv');

let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
  case 'production':
    ENV_FILE_NAME = '.env';
    break;
  case 'test':
    ENV_FILE_NAME = '.env.test';
    break;
  default:
    ENV_FILE_NAME = '.env';
    break;
}

dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME });

const PORT = process.env.PORT || 9000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:9000';
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:8080';

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS ||
  'http://localhost:7000,http://localhost:7001,http://localhost:8080';

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8000';

// Database URL (here we use a local database called medusa-development)
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://localhost/medusa-store';

// Medusa uses Redis, so this needs configuration as well
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Stripe keys
const STRIPE_API_KEY = process.env.STRIPE_API_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Google Auth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

const plugins = [
  'medusa-fulfillment-manual',
  'medusa-payment-manual',
  '@medusajs/admin'
];

module.exports = {
  serverConfig: {
    port: PORT
  },
  projectConfig: {
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,

    database_url: DATABASE_URL,
    database_type: 'postgres',
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
    redis_url: REDIS_URL,
    cli_migration_dirs: ['dist/modules/migrations/*.js']
  },
  // monitoring: {
  //   uriPath: '/monitoring'
  // },
  plugins,
  modules: {
    inventoryService: "@medusajs/inventory",
    stockLocationService: "@medusajs/stock-location",
    eventBus: {
      resolve: "@medusajs/event-bus-redis",
      options: {
        redisUrl: REDIS_URL
      }
    },
    cacheService: {
      resolve: "@medusajs/cache-redis",
      options: {
        redisUrl: REDIS_URL
      }
    }
  },
  featureFlags: {
    product_categories: true
  }
};
