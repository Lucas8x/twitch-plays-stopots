// SETTINGS
export const GAME_URL = 'https://stopots.com';
export const COMMAND_PREFIX = process.env.COMMAND_PREFIX || '!';
export const COMMAND_DELIMITER = process.env.COMMAND_DELIMITER || ':';
export const GAME_LANGUAGES = [
  { value: 'id', text: 'Bahasa' },
  { value: 'ca', text: 'Català' },
  { value: 'de', text: 'Deutsch' },
  { value: 'en', text: 'English' },
  { value: 'es', text: 'Español' },
  { value: 'fr', text: 'Français' },
  { value: 'it', text: 'Italiano' },
  { value: 'pt', text: 'Português' },
];

export const MIN_ANSWER_LENGTH = 2;
export const MAX_ANSWER_LENGTH = 20;

// PRE-GAME SCREEN
export const ENTER_BTN = '//*[@class="login"]/button[@class="enter"]';
export const LOADING_SCREEN = '//*[@class="load"]';
export const USERNAME_INPUT = '//*[@class="perfil"]//input';
export const PLAY_BUTTON =
  '//*[@class="actions"]/button[@class="bt-yellow icon-exclamation"]';
export const AVATAR_EDIT_BUTTON = '//button[@class="edit"]';
export const AVATAR_ICON = (x: number) => `//*[@class="avatar avt${x}"]`;
export const AVATAR_CONFIRM_BUTTON = '//*[@class="buttons"]/button';
export const FADE_ANIMATION =
  '//*[@class="popup-enter-done" or @class="popup-exit popup-exit-active"]';

// COMMON ELEMENTS
export const LETTER = '//*[@id="letter"]/span';
export const YELLOW_BUTTON =
  '//*[@class= "bt-yellow icon-exclamation"or @class="bt-yellow icon-exclamation shake" or @class="bt-yellow icon-exclamation disable"]/strong';
export const YELLOW_BUTTON_CLICKABLE =
  '//*[@class="bt-yellow icon-exclamation" or @class="bt-yellow icon-exclamation shake"]';
export const READY_BUTTON = `${YELLOW_BUTTON_CLICKABLE}/strong`;

export const READY_BUTTON_TEXTS = [
  'SAYA SIAP', //id
  'ESTIC A PUNT', //ca
  'ICH BIN BEREIT', //de
  "I'M READY", //en
  'ESTOY LISTO', //es
  'JE SUIS PRÊT(E)', //fr
  'SONO PRONTO', //it
  'ESTOU PRONTO', //pt
];
export const STOP_BUTTON_TEXTS = [
  'STOP!', //id, ca, en, es, it, pt
  'STOPP!', //de
  'STOP !', //fr
];
export const VALIDATE_BUTTON_TEXTS = [
  'NILAI', //id
  'PUNTUA', //ca
  'BEWERTEN', //de
  'RATE', //EN
  'EVALUAR', //es
  'ÉVALUER', //fr
  'VALUTARE', //it
  'AVALIAR', //pt
];

// FILL ANSWERS SCREEN
const label =
  '//*[@class="ct answers" or @class="ct answers up-enter-done"]//label';
export const FIELD_INPUT = (x: number) => `${label}[${x}]/input`;
export const FIELD_CATEGORY = (x: number) => `${label}[${x}]/span`;

// VALIDATE ANSWERS SCREEN
