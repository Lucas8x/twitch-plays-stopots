import { client } from './twitch';
import { Browser } from './browser';
import {
  COMMAND_PREFIX,
  COMMAND_DELIMITER,
  MAX_ANSWER_LENGTH,
} from './constants';
import { logger } from './utilities/logger';

const usersAnswers: CategoryAnswers = {
  filme: {
    amount: 2,
    value: 'harry potter',
    users: [],
  },
  nome: {
    amount: 1,
    value: 'lucas',
    users: [],
  },
};

const currentRoundCategories: string[] = [];

function addToUsersAnswers(category: string, answer: string, user: string) {
  try {
    const categoryData = usersAnswers[category];
    if (!categoryData) {
      usersAnswers[category] = {
        amount: 1,
        users: [user],
        value: answer,
      };
      return;
    }
    const userAlreadyAnswered = categoryData.users.includes(user);
    if (userAlreadyAnswered) return;

    categoryData.amount++;
    categoryData.users.push(user);
  } catch (error) {
    logger.error(String(error));
  }
}

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
    const browser = new Browser();
    await browser.launch();

    client.on('message', (channel, tags, message, self) => {
      const messageValidation = handleMessage(message);
      if (!messageValidation) return;

      const user = tags.username;
      if (!user) return;

      addToUsersAnswers(
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
