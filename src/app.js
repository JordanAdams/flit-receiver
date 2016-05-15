import 'babel-polyfill';
import logger from './logger';
import redis from './services/redis';
import {receiver} from './receiver';
import {publisher} from './publisher';

// Log starting the receiver
receiver.on('start', () => logger.info('Receiver started'));

// Handle incoming tweets
receiver.on('tweet', async function (tweet) {
  logger.info('Tweet received', {id: tweet.id});

  await publisher.tweet(tweet);

  // Update positive count & publish changes
  if (tweet.sentiment.score > 0) {
    const value = await publisher.incrementPositive();
    logger.info(`Positive count incremented to ${value}`);
  }

  // Update negative count & publish changes
  if (tweet.sentiment.score < 0) {
    const value = await publisher.incrementNegative();
    logger.info(`Negative count incremented to ${value}`);
  }

  // Increment positive words & publish changes
  tweet.sentiment.positive.forEach(async function (word) {
    const value = await publisher.incrementPositiveWord(word);
    logger.info(`Incremented positive word "${word}" to ${value}`);
  });

  // Increment negative words & publish changes
  tweet.sentiment.negative.forEach(async function (word) {
    const value = await publisher.incrementNegativeWord(word);
    logger.info(`Incremented negative word "${word}" to ${value}`);
  });

  logger.info('Tweet processed', {id: tweet.id});
});

// Log receiver errors
receiver.on('error', (error) => logger.error(error));

// Start the receiver when redis is ready
redis.on('ready', () => receiver.start());
