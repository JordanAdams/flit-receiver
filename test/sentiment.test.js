import test from 'ava';
import npmSentiment from 'sentiment';
import sentiment from '../src/sentiment';

const goodScore = npmSentiment('good').score;

test('should analyse text', t => {
  t.deepEqual(sentiment('good'), {
    score: goodScore,
    positive: {good: goodScore},
    negative: {}
  });
});
