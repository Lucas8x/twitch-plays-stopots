import { client } from './twitch';
import { PuppeteerBrowser } from './browsers/puppeteer';
import { WebdriverBrowser } from './browsers/webdriver';
import {
  COMMAND_PREFIX,
  COMMAND_DELIMITER,
  MAX_ANSWER_LENGTH,
} from './utilities/constants';
import { logger } from './utilities/logger';
import { AnswersController } from './controllers/AnswersController';

const answersManager = new AnswersController();

const currentRoundCategories: string[] = [];

function handleMessage(message: string) {
  try {
    message = message.trim().toLowerCase();
    if (!message.startsWith(COMMAND_PREFIX)) return;

    const category = message
      .substring(COMMAND_PREFIX.length, message.indexOf(COMMAND_DELIMITER))
      .trim();

    if (!currentRoundCategories.includes(category)) return;

    const answer = message
      .split(COMMAND_DELIMITER)[1]
      .trim()
      .substring(0, MAX_ANSWER_LENGTH);

    return {
      category,
      answer,
    };
  } catch (error) {
    logger.error(String(error));
  }
}

async function main() {
  try {
    const browser = new PuppeteerBrowser();
    await browser.launch();

    client.on('message', (channel, tags, message, self) => {
      const messageValidation = handleMessage(message);
      if (!messageValidation) return;

      const user = tags.username;
      if (!user) return;

      answersManager.addAnswer(
        messageValidation.category,
        messageValidation.answer,
        user
      );
    });

    //await client.connect();
  } catch (error) {
    console.error(error);
  }
}

main();
