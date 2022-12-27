const pino = require('pino');
let logger;

class Logger {
  constructor() {
    this.logger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname'
        }
      }
    });
  }

  generateLogger(moduleName) {
    const specificLogger = this.logger.child({ moduleName });
    return specificLogger;
  }
}

function getLogger(moduleName) {
  if (!logger) {
    logger = new Logger();
    return logger.generateLogger(moduleName);
  }

  return logger.generateLogger(moduleName);
}

module.exports = getLogger;