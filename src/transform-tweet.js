import sentiment from 'sentiment';

export default (tweet) => {
  return {
    id: tweet.id,
    created: tweet.timestamp_ms,
    text: tweet.text,
    user: {
      id: tweet.user.id,
      username: tweet.user.screen_name
    },
    sentiment: sentiment(tweet.text)
  };
};
