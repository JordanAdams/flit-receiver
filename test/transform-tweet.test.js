import test from 'ava';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

const sentiment = sinon.stub().returns('sentiment');
const transformTweet = proxyquire('../src/transform-tweet', {sentiment}).default;

const tweet = {
  id: 1,
  'timestamp_ms': 1,
  text: 'Example tweet',
  user: {
    id: 1,
    'screen_name': 'user'
  }
};

test('Transforms a tweet', (t) => {
  t.deepEqual(transformTweet(tweet), {
    id: 1,
    created: 1,
    text: 'Example tweet',
    user: {
      id: 1,
      username: 'user'
    },
    sentiment: 'sentiment'
  });
});
