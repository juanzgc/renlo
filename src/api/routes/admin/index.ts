import cors from 'cors'
import { Router } from 'express'
import { registerLoggedInUser } from '../../middlewares/logged-in-user'
import authenticate from '@medusajs/medusa/dist/api/middlewares/authenticate'
import inviteRouter from './invite'

const router = Router()

export default function (adminCorsOptions) {
  // This router will be applied before the core routes.
  // Therefore, the middleware will be executed
  // before all admin routes are hit

  router.use(
    '/admin/*',
    cors(adminCorsOptions),
    unless(authenticate(), '/admin/auth', '/admin/invites/accept'),
    registerLoggedInUser
  )

  inviteRouter(router)

  return router
}

/**
 * Disable a middleware from running on a certain URL, or list of mutliple URLs
 * @param middleware
 * @param paths
 * @returns
 */
const unless =
  (middleware, ...paths) =>
  (req, res, next) =>
    paths.some((path) => path === req.originalUrl)
      ? next()
      : middleware(req, res, next)
