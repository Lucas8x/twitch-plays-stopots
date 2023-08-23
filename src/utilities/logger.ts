import chalk from 'chalk';

const info = (...message: string[]) =>
  console.info(chalk.bgMagenta.bold(' INFO '), ...message);

const warn = (...message: string[]) =>
  console.error(chalk.bgYellow.bold(' WARN '), ...message);

const error = (...message: string[]) =>
  console.error(chalk.bgRed.bold(' ERROR '), ...message);

const log = console.log;

class Logger {
  constructor(private prefix: string, private hex = '#fff') {}

  info = (...message: string[]) =>
    console.info(
      chalk.bgHex(this.hex).bold(this.prefix),
      chalk.bgMagenta.bold(' INFO '),
      ...message
    );

  warn = (...message: string[]) =>
    console.error(
      chalk.bgHex(this.hex).bold(this.prefix),
      chalk.bgYellow.bold(' WARN '),
      ...message
    );

  error = (...message: string[]) =>
    console.error(
      chalk.bgHex(this.hex).bold(this.prefix),
      chalk.bgRed.bold(' ERROR '),
      ...message
    );
}

const logger = { info, warn, error, log };
export { Logger, logger };
