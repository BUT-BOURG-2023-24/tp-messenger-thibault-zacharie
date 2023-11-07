import * as dotenv from 'dotenv'

dotenv.config()

export default {
  DB_ADDRESS: process.env.DB_ADDRESS ?? '',
  DB_ADDRESS_TEST: process.env.DB_ADDRESS_TEST ?? '',
  PORT: process.env.PORT ?? 5000,
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY ?? '',
  EXPIRE_TOKEN_TIME: process.env.EXPIRE_TIME_TOKEN
}
