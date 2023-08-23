import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import * as constants from '../utilities/constants';
import { Logger } from '../utilities/logger';
import { filterAnswers } from '../utilities/utils';

const gameLog = new Logger(' [GME] ', '#FFBF3F');
const browserLog = new Logger(' [BSR] ', '#019D30');

puppeteer.use(StealthPlugin());

interface Options {
  avatar?: number;
  onGetAnswers: () => ICategoryAnswers;
  onClearAnswer: () => void;
}

export class PuppeteerBrowser implements BaseBrowser {
  private currentLetter = '';
  private currentPage: Page | undefined;
  private avatar: number;
  private onGetAnswers: () => ICategoryAnswers;
  private onClearAnswer: () => void;

  constructor({ avatar, onGetAnswers, onClearAnswer }: Options) {
    this.avatar = avatar || 0;
    this.onGetAnswers = onGetAnswers;
    this.onClearAnswer = onClearAnswer;
  }

  private async changeAvatar() {
    try {
      if (this.avatar === 0) return;
    } catch (error) {}
  }

  private async clearInput(input) {
    if (!this.currentPage) {
      throw Error('NO CURRENT PAGE');
    }
    await input.click();
    await input.focus();
    await this.currentPage.keyboard.down('Control');
    await this.currentPage.keyboard.press('A');
    await this.currentPage.keyboard.up('Control');
    await this.currentPage.keyboard.press('Backspace');
  }

  private async joinGame() {
    try {
      gameLog.info('Joining game...');
      if (!this.currentPage) {
        throw Error('NO CURRENT PAGE');
      }

      const joinAnonymouslyButton = await this.currentPage.waitForXPath(
        constants.ENTER_BTN
      );
      if (!joinAnonymouslyButton) {
        throw Error("COULDN'T FIND JOIN BUTTON");
      }
      await joinAnonymouslyButton.click();

      await this.currentPage.waitForXPath(constants.LOADING_SCREEN, {
        hidden: true,
      });

      const usernameInput = await this.currentPage.waitForXPath(
        constants.USERNAME_INPUT
      );
      if (!usernameInput) {
        throw Error("COULDN'T FIND INPUT");
      }

      await this.clearInput(usernameInput);
      await usernameInput.type('Toichi');
      await this.changeAvatar();

      const playButton = await this.currentPage.waitForXPath(
        constants.PLAY_BUTTON
      );
      if (!playButton) {
        throw Error("COULDN'T PLAY BUTTON");
      }

      await new Promise((r) => setTimeout(r, 2000));
      await playButton.click();

      gameLog.info('Successfully joined game.');
    } catch (error) {
      browserLog.error('Failed to join game.', String(error));
    }
  }

  public async writeAnswers(data: IGetAnswersResponse) {
    try {
      if (!this.currentPage) {
        throw Error('NO CURRENT PAGE');
      }
      if (!data || Object.keys(data).length === 0) return;

      const defaultGameCategoriesSize = 13; //TODO: detect with xpath

      for (let i = 1; i < defaultGameCategoriesSize; i++) {
        const categoryElement = await this.currentPage.waitForXPath(
          constants.FIELD_CATEGORY(i),
          { timeout: 0 }
        );
        if (!categoryElement) continue;

        const categoryContent = await categoryElement.getProperty(
          'textContent'
        );
        const categoryValue = categoryContent.remoteObject().value;
        const category = categoryValue && String(categoryValue).toLowerCase();
        if (!category || !(category in data)) continue;

        const answer = data[category].toLowerCase();
        if (!answer) continue;

        const [fieldInput] = await this.currentPage.$x(
          constants.FIELD_INPUT(i)
        );

        const inputValue = await this.currentPage.evaluate(
          (x) => x.value,
          fieldInput
        );

        if (inputValue && String(inputValue).toLowerCase() === answer) {
          continue;
        }
        gameLog.info(`Filling ${category} with ${answer}`);
        await this.clearInput(fieldInput);
        await fieldInput.type(answer);
      }
    } catch (error) {
      browserLog.error('Failed fill answers.', String(error));
    }
  }

  public validateAnswers() {
    try {
    } catch (error) {
      browserLog.error('Failed to validate answers.', String(error));
    }
  }

  private async autoReady() {
    try {
      if (!this.currentPage) {
        throw Error('NO CURRENT PAGE');
      }

      const readyButton = await this.currentPage.waitForXPath(
        constants.READY_BUTTON,
        { timeout: 0 }
      );
      if (!readyButton) return;

      const buttonTextContent = await readyButton.getProperty('textContent');
      const buttonTextValue = buttonTextContent.remoteObject().value;
      if (
        buttonTextValue &&
        String(buttonTextValue).toUpperCase() !== constants.READY_BUTTON_TEXT
      )
        return;

      const readyButtonClickable = await this.currentPage.waitForXPath(
        constants.YELLOW_BUTTON_CLICKABLE,
        { timeout: 0 }
      );
      if (!readyButtonClickable) return;

      await readyButtonClickable.click();
    } catch (error) {
      browserLog.error("Couldn't' press ready.", String(error));
    }
  }

  private async checkAfk() {
    try {
    } catch (error) {}
  }

  private async detectCurrentLetter() {
    try {
      if (!this.currentPage) {
        throw Error('NO CURRENT PAGE');
      }
      const letterElement = await this.currentPage.waitForXPath(
        constants.LETTER
      );
      if (!letterElement) return;

      const letterTextContent = await letterElement.getProperty('textContent');
      if (!letterTextContent) return;

      const letterText = await letterTextContent.jsonValue();
      if (!letterText) return;

      if (this.currentLetter !== letterText) {
        this.onClearAnswer();
        gameLog.info(`Letter changed to ${letterText}`);
      }
      this.currentLetter = letterText;
    } catch (error) {
      browserLog.error('Failed to detect current letter', String(error));
    }
  }

  private async detectButtonState() {
    try {
      if (!this.currentLetter) return;
      if (!this.currentPage) {
        throw Error('NO CURRENT PAGE');
      }

      const button = await this.currentPage.waitForXPath(
        constants.YELLOW_BUTTON,
        { timeout: 0 }
      );
      if (!button) return;

      const buttonTextContent = await button.getProperty('textContent');
      const buttonTextValue = buttonTextContent.remoteObject().value;
      if (!buttonTextValue) return;

      switch (String(buttonTextValue).toUpperCase()) {
        case 'STOP!':
          const answers = this.onGetAnswers();
          const filteredAnswers = filterAnswers(this.currentLetter, answers);
          await this.writeAnswers(filteredAnswers);
          break;
        case 'AVALIAR':
          break;
      }
    } catch (error) {
      browserLog.error('Failed to detect button state', String(error));
    }
  }

  private async loop() {
    try {
      setInterval(
        async () =>
          Promise.all([
            await this.detectCurrentLetter(),
            await this.detectButtonState(),
            await this.autoReady(),
            await this.checkAfk(),
          ]),
        3000
      );
    } catch (error) {}
  }

  public async launch() {
    try {
      browserLog.info('Launching...');
      const browser = await puppeteer.launch({ headless: false });
      const pages = await browser.pages();

      let page = pages[0];
      if (pages.length === 0) {
        page = await browser.newPage();
      }
      this.currentPage = page;

      await page.goto(constants.GAME_URL);
      await this.joinGame();
      await this.loop();
    } catch (error) {
      browserLog.error('Failed to launch.', String(error));
    }
  }
}
