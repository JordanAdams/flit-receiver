import path from 'path';
import winston from 'winston';
// import config from './config';

winston.add(winston.transports.File, {
  filename: path.join(__dirname, '..', 'logs', 'application.log')
});

export default winston;
