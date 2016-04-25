import bluebird from 'bluebird';
import redis from 'redis';
import logger from '../logger';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();

client.on('error', error => {
  throw error;
});

client.on('connect', () => logger.info('Redis connected'));
client.on('ready', () => logger.info('Redis ready'));

export default client;
