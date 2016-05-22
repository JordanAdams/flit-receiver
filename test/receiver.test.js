import test from 'ava';
import sinon from 'sinon';
import {EventEmitter} from 'events';
import {createReceiver} from '../src/receiver';

const twitterStream = new EventEmitter();
const twitter = {
  stream: sinon.stub().returns(twitterStream)
};
const transform = sinon.stub().returnsArg(0);
const filter = sinon.stub().returns(true);

const receiver = createReceiver({twitter, transform, filter});

test('Emits start event', (t) => {
  const handler = sinon.spy();

  receiver.on('start', handler);
  receiver.start();

  t.true(handler.calledOnce);
});

test('Connects to twitter', (t) => {
  receiver.start();
  t.true(twitter.stream.calledWith('statuses/sample'));
});

test('Handles tweets', (t) => {
  const handler = sinon.spy();
  const tweet = {id: 1, text: 'This is a tweet'};

  receiver.on('tweet', handler);
  receiver.start();
  twitterStream.emit('tweet', tweet);

  t.true(handler.calledWith(tweet));
});

test('Handles Errors', (t) => {
  const handler = sinon.spy();
  const error = new Error('Example error');

  receiver.on('error', handler);
  receiver.start();

  twitterStream.emit('error', error);

  t.true(handler.calledWith(error));
});
