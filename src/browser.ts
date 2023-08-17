import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import { GAME_URL } from './utilities/constants';
import { logger } from './utilities/logger';

puppeteer.use(StealthPlugin());

interface Options {}

export class Browser {
  private currentLetter = '';
  private currentPage: Page | undefined;

  constructor() {}

  private joinGame() {
    try {
    } catch (error) {}
  }

  writeAnswers() {
    try {
    } catch (error) {}
  }

  validateAnswers() {
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

  loop() {
    try {
    } catch (error) {}
  }

  async launch() {
    try {
      logger.log('[Browser] Launching...');
      const browser = await puppeteer.launch({ headless: false });

      let page = await browser.pages()[0];
      if (browser.pages.length === 0) {
        page = await browser.newPage();
      }
      this.currentPage = page;

      await page.goto(GAME_URL);
    } catch (error) {
      logger.error('[Browser] Failed to launch', String(error));
    }
  }
}
