
import sentiment from 'sentiment';
import twitter from './services/twitter';
import redis from './services/redis';

console.log(process.env.TWITTER_CONSUMER_KEY);

twitter.stream('statuses/sample', {}, (stream) => {
  stream.on('data', async function (data) {
    console.log(new Date().getTime(), 'Tweet received: ', data.id);
    if (!data.text) {
      return;
    }

    const results = sentiment(data.text);
    if (results.score === 0) {
      return;
    }

    const tweet = {
      id: data.id,
      created: data.timestamp_ms,
      text: data.text,
      user: {
        id: data.user.id,
        username: data.user.screen_name
      },
      results
    };

    if (tweet.results.score > 0) {
      await redis.incrAsync('positive');
    } else {
      await redis.incrAsync('negative');
    }

    results.positive.forEach(word => redis.zincrbyAsync('positive_words', 1, word));
    results.negative.forEach(word => redis.zincrbyAsync('negative_words', 1, word));

    await redis.saddAsync('tweets', JSON.stringify(tweet));

    console.log(new Date().getTime(), 'Tweet done: ', data.id);
  });

  stream.on('error', err => console.log(err));
});
