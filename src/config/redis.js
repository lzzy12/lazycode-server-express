import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connection', () => console.log('Redis DB Connected'));

export default client;