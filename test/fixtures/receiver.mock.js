import {EventEmitter} from 'events';
import {createReceiver} from '../../src/receiver';

export const twitterStream = new EventEmitter();
export const twitter = {
  stream: () => twitterStream
};

export const transform = (tweet) => tweet;
export const filter = () => true;

export const receiver = createReceiver({twitter, transform, filter});

export default receiver;
