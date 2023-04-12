export const isLoggedInUser = (container) => {
  if (
    Object.keys(container).includes('loggedInUser') &&
    container.loggedInUser.store_id
  ) {
    return true
  }
  return false
}
