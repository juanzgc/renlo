import { EventBusService } from '@medusajs/medusa'
import UserService from '../services/user'

interface Params {
  eventBusService: EventBusService
  userService: UserService
}

export class CreateUserSubscriber {
  constructor({ eventBusService, userService }: Params) {
    eventBusService.subscribe(
      UserService.Events.CREATED,
      this.handleUserCreated
    )
  }

  handleUserCreated = async (data) => {
    console.log('User created.')
  }
}

export default CreateUserSubscriber
