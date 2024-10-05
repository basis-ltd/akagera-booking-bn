import winston from 'winston';
import { ValidationError } from './errors.helper';

interface LogEntry {
    message: string;
    level: string;
    timestamp: string;
    [key: string]: string;
  }

// CREATE LOGGER
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()) }),
        new winston.transports.File({ filename: 'logs/activities.log', format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()) }),
        new winston.transports.File({ filename: 'logs/critical.log', level: 'warn', format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()) })
    ]
});

export default logger;

export const formatLog = (entry: string): LogEntry => {
    try {
        const cleanedEntry = entry
          ?.replace(/\n/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        const obj: {
          message: string;
          level: string;
          timestamp: string;
          [key: string]: string;
        } = {
          message: '',
          level: '',
          timestamp: '',
        };
        const regex = /(\w+):\s*'([^']*)'/g;
        let match;

        while ((match = regex.exec(String(cleanedEntry))) !== null) {
          obj[match[1]] = match[2];
        }

        return obj;
      } catch (err) {
        throw new ValidationError(err as string);
      }
};
