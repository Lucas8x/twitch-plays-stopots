import tmi from 'tmi.js';
import { Logger } from './utilities/logger';

const logger = new Logger(' [TMI] ', '#A970FF');

const client = new tmi.Client({
  options: {
    debug: true,
  },
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [process.env.CHANNEL || 'lucas8x'],
  logger,
});

client.addListener('connected', (address, port) => {
  logger.info('Connected! Waiting for messages...');
});

client.addListener('disconnected', (reason) => {
  logger.warn('Disconnected from the server! Reason: ' + reason);
});

export { client };
