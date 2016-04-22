import 'babel-polyfill';
import sentiment from 'sentiment';
import twitter from './services/twitter';
import redis from './services/redis';
import config from './config';

const keywords = config.keywords.join(',');

twitter.stream('statuses/filter', {track: keywords}, (stream) => {
  stream.on('data', async function (data) {
    if (!data.text) {
      return;
    }

    const results = sentiment(data.text);
    if (results.score === 0) {
      return;
    }

    // Increment positive/negative
    if (results.score > 0) {
      redis.incrAsync('positive');
    } else {
      redis.incrAsync('negative');
    }

    // Increment individual positive words
    results.positive.forEach(word => redis.zincrbyAsync('positive_words', 1, word));

    // Increment individual negative words
    results.negative.forEach(word => redis.zincrbyAsync('negative_words', 1, word));

    // Publish tweet
    redis.publish('tweets', {
      id: data.id,
      created: data.timestamp_ms,
      text: data.text,
      user: {
        id: data.user.id,
        username: data.user.screen_name
      },
      results
    });
  });

  stream.on('error', err => console.log(err));
});
