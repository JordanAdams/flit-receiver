import defaultRedis from './services/redis';

/**
 * Create a new publisher
 *
 * @param  {Object} options Publisher options
 * @return {Object}         Publisher
 */
export const createPublisher = ({redis}) => {
  /**
   * Publish a tweet
   * @param  {Object} tweet Tweet to publish
   * @return {Promise}
   */
  const tweet = (tweet) => redis.publish('tweet', JSON.stringify(tweet))

  /**
   * Increment the positive counter
   *
   * @return {Promise} New positive value
   */
  const incrementPositive = async function () {
    const value = await redis.incrAsync('positive');

    redis.publish('positive', parseInt(value, 10));

    return value;
  };

  /**
   * Increment the negative counter
   *
   * @return {Promise} New negative value
   */
  const incrementNegative = async function () {
    const value = await redis.incrAsync('negative');

    redis.publish('negative', parseInt(value, 10));

    return value;
  };

  /**
   * Increment the value of a positive word
   *
   * @param  {String} word Word to increment
   * @return {Promise}     New word value
   */
  const incrementPositiveWord = async function (word) {
    const value = await redis.zincrbyAsync('positive_words', 1, word);

    const payload = JSON.stringify({word, value});
    redis.publish('positive_word', payload);

    return value;
  };

  /**
   * Increment the value of a negative word
   *
   * @param  {String} word Word to Increment
   * @return {Promise}     New word value
   */
  const incrementNegativeWord = async function (word) {
    const value = await redis.zincrbyAsync('negative_words', 1, word);

    const payload = JSON.stringify({word, value});
    redis.publish('negative_word', payload);

    return value;
  };

  return {
    tweet,
    incrementPositive,
    incrementNegative,
    incrementPositiveWord,
    incrementNegativeWord
  };
};

export const publisher = createPublisher({
  redis: defaultRedis
});
