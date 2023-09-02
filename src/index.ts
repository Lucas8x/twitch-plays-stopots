import 'dotenv/config';
import { client } from './twitch';
import { PuppeteerBrowser } from './browsers/puppeteer';
import { WebdriverBrowser } from './browsers/webdriver';
import {
  COMMAND_PREFIX,
  COMMAND_DELIMITER,
  MAX_ANSWER_LENGTH,
  MIN_ANSWER_LENGTH,
} from './utilities/constants';
import { logger } from './utilities/logger';
import { AnswersController } from './controllers/AnswersController';
import { initializeServer } from './fakeChat';
import { normalizeCategory } from './utilities/utils';

const answersManager = new AnswersController();

function handleMessage(message: string) {
  try {
    message = message.trim().toLowerCase();
    if (!message.startsWith(COMMAND_PREFIX)) return;

    let category = message
      .substring(COMMAND_PREFIX.length, message.indexOf(COMMAND_DELIMITER))
      ?.trim();
    category = normalizeCategory(category);
    if (!category) return;

    const answer = message
      .split(COMMAND_DELIMITER)[1]
      ?.trim()
      .substring(0, MAX_ANSWER_LENGTH);
    if (!answer || answer.length < MIN_ANSWER_LENGTH) return;

    return {
      category,
      answer,
    };
  } catch (error) {
    logger.error(String(error));
  }
}

function addAnswer(username: string, rawMessage: string) {
  const messageValidation = handleMessage(rawMessage);
  if (!messageValidation) return;
  const { category, answer } = messageValidation;
  answersManager.addAnswer(category, answer, username);
}

async function main() {
  try {
    const browser = new PuppeteerBrowser({
      avatar: process.env.GAME_AVATAR_ID,
      onGetAnswers: () => answersManager.getAnswers(),
      onClearAnswer: () => answersManager.clearAnswers(),
    });
    await browser.launch();

    client.on('message', (channel, tags, message, self) => {
      const user = tags.username;
      if (!user) return;
      addAnswer(user, message);
    });

    if (process.env.ENABLE_TEST_CHAT === 'true') {
      initializeServer({
        onMessage: addAnswer,
      });
    }

    await client.connect();
  } catch (error) {
    await client.disconnect();
    console.error(error);
  }
}

main();
