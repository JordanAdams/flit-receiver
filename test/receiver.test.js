import test from 'ava';
import sinon from 'sinon';
import {EventEmitter} from 'events';
import Receiver from '../src/receiver';

const twitterStream = new EventEmitter();
const twitter = {
  stream: (endpoint, params, callback) => callback(twitterStream)
};

const transform = (tweet) => tweet;
const filter = () => true;

const startHandler = sinon.spy();
const tweetHandler = sinon.spy();
const errorHandler = sinon.spy();

const receiver = new Receiver({twitter, transform, filter});

receiver.on('start', startHandler);
receiver.on('tweet', tweetHandler);
receiver.on('error', errorHandler);
receiver.start();

test('Emits start event', (t) => t.true(startHandler.calledOnce));

test('Emits tweet event', (t) => {
  const tweet = {sentiment: {score: 1}};

  twitterStream.emit('data', tweet);

  // t.true(transform.calledWith(tweet));
  // t.true(filter.calledWith(tweet));
  t.true(tweetHandler.calledOnce);
});

test('Emits error event', (t) => {
  const err = new Error('example error');

  twitterStream.emit('error', err);

  t.true(errorHandler.calledWith(err));
});
