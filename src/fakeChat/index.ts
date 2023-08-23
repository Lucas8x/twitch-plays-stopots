import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { Logger } from '../utilities/logger';

const logger = new Logger(' [EXP] ', '#5874B5');

interface Params {
  onMessage: (username: string, message: string) => void;
}

export function initializeServer({ onMessage }: Params) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const indexFilePath = path.join(__dirname, 'index.html');

  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    res.sendFile(indexFilePath);
  });

  app.post('/', (req, res) => {
    try {
      const { username, message } = req.body;
      onMessage(username, message);
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  });

  app.listen(3333, () => {
    logger.info('Test chat listening on http://localhost:3333');
  });
}
