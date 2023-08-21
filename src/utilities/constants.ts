// SETTINGS
export const GAME_URL = 'https://stopots.com.br/';
export const COMMAND_PREFIX = '!';
export const COMMAND_DELIMITER = ':';

export const MAX_ANSWER_LENGTH = 20;

// PRE-GAME SCREEN
export const ENTER_BTN = '//*[@class="login"]/button[@class="enter"]';
export const LOADING_SCREEN = '//*[@class="load"]';
export const USERNAME_INPUT = '//*[@class="perfil"]//input';
export const PLAY_BUTTON =
  '//*[@class="actions"]/button[@class="bt-yellow icon-exclamation"]';

//
export const LETTER = '//*[@id="letter"]/span';
export const YELLOW_BUTTON_CLICKABLE =
  '//*[@class="bt-yellow icon-exclamation" or @class="bt-yellow icon-exclamation shake"]';
export const READY_BUTTON = `${YELLOW_BUTTON_CLICKABLE}/strong`;
export const READY_BUTTON_TEXT = 'ESTOU PRONTO';

// FILL ANSWERS SCREEN
const label =
  '//*[@class="ct answers" or @class="ct answers up-enter-done"]//label';
export const FIELD_INPUT = (x: number) => `${label}[${x}]/input`;
export const FIELD_CATEGORY = (x: number) => `${label}[${x}]/span`;

// VALIDATE ANSWERS SCREEN
