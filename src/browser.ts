import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import * as constants from './utilities/constants';
import { logger } from './utilities/logger';

puppeteer.use(StealthPlugin());

interface Options {}

export class Browser {
  private currentLetter = '';
  private currentPage: Page | undefined;

  constructor() {}

  private async joinGame() {
    try {
      logger.log('[Browser] Joining game...');
      if (!this.currentPage) {
        throw Error('NO CURRENT PAGE');
      }

      const btn = await this.currentPage.waitForXPath(constants.ENTER_BTN);
      if (!btn) {
        throw Error("COULDN'T FIND JOIN BUTTON");
      }

      await btn.click();

      await this.currentPage.waitForXPath(constants.LOADING_SCREEN, {
        hidden: true,
      });

      const input = await this.currentPage.waitForXPath(
        constants.USERNAME_INPUT
      );
      if (!input) {
        throw Error("COULDN'T FIND INPUT");
      }

      await input.click();
      await input.focus();

      await this.currentPage.keyboard.down('Control');
      await this.currentPage.keyboard.press('A');
      await this.currentPage.keyboard.up('Control');
      await this.currentPage.keyboard.press('Backspace');

      await input.type('Toichi');
    } catch (error) {
      logger.error('[Browser] Failed to join game', String(error));
    }
  }

  public writeAnswers() {
    try {
    } catch (error) {}
  }

  public validateAnswers() {
    try {
    } catch (error) {}
  }

  private autoReady() {
    try {
    } catch (error) {}
  }

  private checkAfk() {
    try {
    } catch (error) {}
  }

  private loop() {
    try {
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
    } catch (error) {
      logger.error('[Browser] Failed to launch', String(error));
    }
  }
}
