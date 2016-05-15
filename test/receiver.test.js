import test from 'ava';
import sinon from 'sinon';
import {receiver, twitterStream} from './fixtures/receiver.mock'

const tweetHandler = sinon.spy();
const errorHandler = sinon.spy();

test('Emits start event', (t) => {
  const handler = sinon.spy();

  receiver.on('start', handler);
  receiver.start();

  t.true(handler.called);
});
