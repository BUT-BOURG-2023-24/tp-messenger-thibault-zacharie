import mongoose from 'mongoose'
import config from './config'

class Database {
  fromTest: boolean

  constructor (fromTest: boolean) {
    this.fromTest = fromTest
  }

  async connect (): Promise<void> {
    mongoose.connect(config.DB_ADDRESS)
      .then(() => { console.log('DB Connected !') })
      .catch((reportError) => { console.log('Error while connecting :' + reportError) })
  }
}

export default Database
export type { Database }
