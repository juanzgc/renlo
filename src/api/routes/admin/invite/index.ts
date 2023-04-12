import { Router } from 'express'
import acceptInvite from './accept-invite'

export default function (router: Router) {
  router.post('/admin/invites/accept', acceptInvite)

  return router
}
