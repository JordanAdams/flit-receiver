export default (tweet) => {
  if (tweet.sentiment.score === 0) {
    return false;
  }

  return true;
};
