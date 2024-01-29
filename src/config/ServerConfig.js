import dotenv from 'dotenv'

dotenv.config();

export default {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_PORT: process.env.REDIS_PORT
}