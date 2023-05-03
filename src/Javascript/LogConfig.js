import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { MongoDB } from "winston-mongodb";
//TODO https://www.npmjs.com/package/winston#formats
import { colors } from "./syntax.js";
import moment from "moment";

/*
Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough.
Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey.
Background colors: blackBG, redBG, greenBG, yellowBG, blueBG magentaBG, cyanBG, whiteBG
const 
*/

const customLevels = {
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
  },

  colors: {
    emerg: 'red',
    alert: 'magenta',
    crit: 'green',
    error: 'bold green',
    warning: 'bold cyan',
    notice: 'bold blue',
    info: 'cyan',
    debug: 'blue'
  }
};

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.align(),
  winston.format.printf(
    info => `${moment(new Date().getTime()).format("HH:mm A")} ${info.level}: ${colors.blue(info.message)}`,
    notice => `${moment.now()} ${notice.level}: ${colors.blue(notice.message)}`,
  ));

const transport = new DailyRotateFile({
  filename: 'LOGS-%DATE%.log',
  dirname: '../Logs/Logs',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '1d',
  prepend: true,
  level: "info",
  json: true
})

const transportOne = new DailyRotateFile({
  filename: 'tfbladeLOGS-%DATE%.log',
  dirname: '../Logs/tfblade',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '1d',
  prepend: true,
  level: "info",
  json: true
})

const transportTwo = new DailyRotateFile({
  filename: 'iwdominateLOGS-%DATE%.log',
  dirname: '../Logs/iwdominate',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '1d',
  prepend: true,
  level: "info",
  json: true
})

const transportThree = new DailyRotateFile({
  filename: 'akanemskoLOGS-%DATE%.log',
  dirname: '../Logs/akanemsko',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '1d',
  prepend: true,
  level: "info",
  json: true

})

const transportFour = new DailyRotateFile({
  filename: 'perkz_lol-%DATE%.log',
  dirname: '../Logs/perkz_lol',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '1d',
  prepend: true,
  level: "info",
  json: true
})

const privateMessage = new DailyRotateFile({
  filename: 'whispers-%DATE%.log',
  dirname: '../Logs/whispers',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '1d',
  prepend: true,
  level: "notice",
  json: true
})

const exceptions = new DailyRotateFile({
  filename: 'exceptions-%DATE%.log',
  dirname: '../Logs/exceptions',
  datePattern: 'YYYY-MM-DD',
  format: logFormat,
  maxSize: '20m',
  maxFiles: '1d',
  prepend: true,
  json: true,
  handleRejections: true,
  handleExceptions: true
})

const offlineOne = winston.createLogger({
  format: logFormat,
  transports: [
    transportOne
  ],
  exitOnError: false
})

const offlineTwo = winston.createLogger({
  format: logFormat,
  transports: [
    transportTwo
  ],
  exitOnError: false
})

const offlineThree = winston.createLogger({
  format: logFormat,
  transports: [
    transportThree
  ],
  exitOnError: false
})

const offlineFour = winston.createLogger({
  format: logFormat,
  transports: [
    transportFour
  ],
  exitOnError: false
})

export const offlineLogger = { offlineOne, offlineTwo, offlineThree, offlineFour }

const logger = winston.createLogger({
  format: logFormat,
  levels: customLevels.levels,
  transports: [transport, privateMessage,
    new winston.transports.Console({
      format: logFormat
    })
  ],
  exceptionHandlers: [
    exceptions,
    new winston.transports.Console({
      level: "error",
      format: winston.format.colorize(),
    })
  ],
  rejectionHandlers: [
    exceptions, new winston.transports.Console({
      level: "error",
      format: winston.format.colorize()
    })
  ],
  debug: [
  ],
  exitOnError: false
});

const sysTransport = new DailyRotateFile({
  filename: 'syslogs-%DATE%.log',
  dirname: '../Logs/Logs',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '1d',
  prepend: true,
  level: "info",
  json: true
})

const syslogs = winston.createLogger({
  format: logFormat,
  transports: [
    sysTransport,
    new winston.transports.Console({
      level: "info",
      format: winston.format.colorize()
    }),
  ]
});

const dmTransport = new DailyRotateFile({
  filename: 'dm-%DATE%.log',
  dirname: '../Logs/Logs',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '1d',
  prepend: true,
  level: "info",
  json: true
})

let dmLogger = winston.createLogger({
  format: logFormat,
  transports: [
    dmTransport,
    new winston.transports.Console({
      level: "info",
      format: winston.format.colorize()
    }),
  ]
})

export const loggers = { logger, syslogs, dmLogger };
