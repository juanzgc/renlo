import {
  MEDUSA_RESOLVER_KEYS,
  MedusaAuthenticatedRequest,
  MedusaMiddleware,
  Middleware
} from 'medusa-extender';
import { NextFunction, Request, Response } from 'express';
import { Connection } from 'typeorm';
import UserSubscriber from '../subscribers/user.subscriber';

@Middleware({
  requireAuth: true,
  routes: [{ method: 'post', path: '/admin/users' }]
})
export class AttachUserSubscriberMiddleware implements MedusaMiddleware {
  public consume(
    req: MedusaAuthenticatedRequest | Request,
    res: Response,
    next: NextFunction
  ): void {
    const { connection } = req.scope.resolve(MEDUSA_RESOLVER_KEYS.manager) as {
      connection: Connection;
    };
    UserSubscriber.attachTo(connection);
    return next();
  }
}
