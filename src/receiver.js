import {EventEmitter} from 'events';
import defaultTwitter from './services/twitter';
import defaultTransform from './transform-tweet';
import defaultFilter from './filter-tweet';

export const createReceiver = ({
  twitter,
  transform,
  filter
}) => {
  const emitter = new EventEmitter();

  /**
   * Attach an event handler
   *
   * @param  {String}   event   Event name
   * @param  {function} handler Event handler
   */
  const on = (event, handler) => emitter.on(event, handler);

  /**
   * Starts the receiver
   */
  const start = () => {
    twitter.stream('/statuses/sample', {}, stream => {
      emitter.emit('start');

      stream.on('data', (data) => {
        if (!data.id || !data.text) {
          return;
        }

        const tweet = transform(data);

        if (!filter(tweet)) {
          return;
        }

        emitter.emit('tweet', tweet);
      });

      stream.on('error', err => emitter.emit('error', err));
    });
  };

  return {
    on,
    start
  };
};

export const receiver = createReceiver({
  twitter: defaultTwitter,
  transform: defaultTransform,
  filter: defaultFilter
});
