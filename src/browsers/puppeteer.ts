import type { MouseButton, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import * as constants from '../utilities/constants';
import { logger } from '../utilities/logger';

puppeteer.use(StealthPlugin());

interface Options {}

export class PuppeteerBrowser implements BaseBrowser {
  private currentLetter = '';
  private currentPage: Page | undefined;

  constructor(private avatar = 0) {}

  private async changeAvatar() {
    try {
      if (this.avatar === 0) return;
    } catch (error) {}
  }

  private async joinGame() {
    try {
      logger.log('[Game] Joining game...');
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

      await usernameInput.click();
      await usernameInput.focus();

      await this.currentPage.keyboard.down('Control');
      await this.currentPage.keyboard.press('A');
      await this.currentPage.keyboard.up('Control');
      await this.currentPage.keyboard.press('Backspace');

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

      logger.log('[Game] Successfully joined game.');
    } catch (error) {
      logger.error('[Browser] Failed to join game.', String(error));
    }
  }

  public async writeAnswers() {
    try {
      if (!this.currentPage) {
        throw Error('NO CURRENT PAGE');
      }

      const defaultGameCategoriesSize = 13;

      for (let i = 1; i < defaultGameCategoriesSize; i++) {
        const fieldInput = await this.currentPage.waitForXPath(
          constants.FIELD_INPUT(i)
        );
      }
    } catch (error) {
      logger.error('[Browser] Failed fill answers.', String(error));
    }
  }

  public validateAnswers() {
    try {
    } catch (error) {
      logger.error('[Browser] Failed to validate answers.', String(error));
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
      logger.error("[Browser] Couldn't' press ready.", String(error));
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

      this.currentLetter = letterText;
    } catch (error) {
      logger.error('[Browser] Failed to detect current letter', String(error));
    }
  }

  private async detectButtonState() {
    try {
      await this.detectCurrentLetter();
    } catch (error) {
      logger.error('[Browser] Failed to detect button state', String(error));
    }
  }

  private async loop() {
    try {
      setInterval(
        async () =>
          Promise.all([
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
      logger.log('[Browser] Launching...');
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
      logger.error('[Browser] Failed to launch.', String(error));
    }
  }
}
