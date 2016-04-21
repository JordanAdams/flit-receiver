import {map} from 'lodash';

export default (redisClient) => {
  const manager = {
    update: (scores) => {
      const promises = map(scores, (score, word) => {
        return redisClient.zincrbyAsync('words', score, word);
      });

      return Promise.all(promises);
    }
  };

  return manager;
};
