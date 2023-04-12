import configLoader from '@medusajs/medusa/dist/loaders/config'
import adminRouter from './routes/admin/index'

export default function (rootDirectory: string) {
  const config = configLoader(rootDirectory)

  const adminCors = {
    origin: config.projectConfig.admin_cors.split(','),
    credentials: true,
  }

  const routers = [adminRouter(adminCors)]

  return [...routers]
}
