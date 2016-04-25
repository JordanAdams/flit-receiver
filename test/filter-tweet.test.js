import test from 'ava';
import filterTweet from '../src/filter-tweet';

test('Allows tweets with a sentiment score above 0', (t) => {
  t.true(filterTweet({
    sentiment: {score: 10}
  }));
});

test('Allows tweets with a sentiment score below 0', (t) => {
  t.true(filterTweet({
    sentiment: {score: -10}
  }));
});

test('Filters out tweets with a sentiment score of 0', (t) => {
  t.false(filterTweet({
    sentiment: {score: 0}
  }));
});
