import { AwilixContainer } from 'awilix'
import glob from 'glob'
import path from 'path'

const entitySubscriber = async (container: AwilixContainer, options) => {
  const corePath = '../typeormSubscribers/*.js'
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    const loaded = require(fn).default
    loaded.attach()
  })
}

export default entitySubscriber
