import 'babel-polyfill';
import logger from './logger';
import Receiver from './receiver';
import redis from './services/redis';

const receiver = new Receiver();

// Log starting the receiver
receiver.on('start', () => logger.info('Receiver started'));

// Handle incoming tweets
receiver.on('tweet', async function (tweet) {
  logger.info('Tweet received', {id: tweet.id});

  // Update positive count & publish changes
  if (tweet.sentiment.score > 0) {
    const positive = await redis.incrAsync('positive');
    logger.info(`Positive count incremented to ${positive}`);

    redis.publish('positive_changed', positive);
  }

  // Update negative count & publish changes
  if (tweet.sentiment.score < 0) {
    const negative = await redis.incrAsync('negative');
    logger.info(`Negative count incremented to ${negative}`);

    redis.publish('negative_changed', negative);
  }

  // Increment positive words & publish changes
  tweet.sentiment.positive.forEach(async function (word) {
    const count = await redis.zincrbyAsync('positive_words', 1, word);
    logger.info(`Incremented positive word "${word}" to ${count}`);

    redis.publish('positive_word_changed', JSON.stringify({word, count}));
  });

  // Increment negative words & publish changes
  tweet.sentiment.negative.forEach(async function (word) {
    const count = await redis.zincrbyAsync('negative_words', 1, word);
    logger.info(`Incremented negative word "${word}" to ${count}`);

    redis.publish('negative_word_changed', JSON.stringify({word, count}));
  });

  // Publish tweet over redis
  await redis.publishAsync('tweet', JSON.stringify(tweet));
  logger.info('Tweet published to redis', {id: tweet.id});

  logger.info('Tweet processed', {id: tweet.id});
});

// Log receiver errors
receiver.on('error', (error) => logger.error(error));

// Start the receiver when redis is ready
redis.on('ready', () => receiver.start());
