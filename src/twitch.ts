import tmi from 'tmi.js';
import { logger } from './utilities/logger';

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [''],
});

client.addListener('connected', (address, port) => {
  logger.info('[TMI] Connected! Waiting for messages...');
});

client.addListener('disconnected', (reason) => {
  logger.warn('[TMI] Disconnected from the server! Reason: ' + reason);
});

export { client };
