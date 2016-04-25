import twitter from './services/twitter';
import transform from './transform-tweet';
import filter from './filter-tweet';
import {EventEmitter} from 'events';

const defaults = {twitter, transform, filter};

export default class Receiver {
  constructor(options) {
    this.options = Object.assign(defaults, options);
    this.twitter = this.options.twitter;
    this.transform = this.options.transform;
    this.filter = this.options.filter;
    this.emitter = new EventEmitter();
  }

  on(event, handler) {
    this.emitter.on(event, handler);
  }

  start() {
    this.twitter.stream('/statuses/sample', {'stall_warnings': true}, stream => {
      this.emitter.emit('start');

      stream.on('data', (tweet) => {
        if (!tweet.id || !tweet.text) {
          console.log(tweet);
          return;
        }

        const transformed = this.transform(tweet);

        if (!this.filter(transformed)) {
          return;
        }

        this.emitter.emit('tweet', transformed);
      });

      stream.on('error', err => this.emitter.emit('error', err));
    });
  }
}
