import { createClient } from 'redis';
import ServerConfig from './ServerConfig.js';

const client = createClient({
        password: ServerConfig.REDIS_PASSWORD,
        socket: {
        host: ServerConfig.REDIS_URL,
        port: ServerConfig.REDIS_PORT
    }
});
client.on('error', err => console.log('Redis Client Error', err));
client.on('connection', () => console.log('Redis DB Connected'));

export default client;