import { makeApp } from './app'
import Database from './database/database'
import config from './config'

async function startServer (): Promise<void> {
  const DBInstance = new Database(false)
  const { server } = await makeApp(DBInstance)

  server.listen(config.PORT, () => {
    console.log(`Server is listening on http://localhost:${config.PORT}`)
  })
}

startServer().catch((error: Error) => {
  console.error('Error starting the server:', error)
})
