import { User } from '../../models/user'
import UserService from '../../services/user'

export async function registerLoggedInUser(req, res, next) {
  let loggedInUser: User | null = null
  console.log('registering logged in user')
  if (req?.user?.userId) {
    console.log('user logged in')
    const userService = req.scope.resolve('userService') as UserService
    loggedInUser = (await userService.retrieve(req.user.userId)) as User
  }

  req.scope.register({
    loggedInUser: {
      resolve: () => loggedInUser,
    },
  })

  next()
}
