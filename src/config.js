import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.join(__dirname, '..', '.env')});

export default {
  app: {
    name: 'Flit'
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }
};
