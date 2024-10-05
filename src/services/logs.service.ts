import fs from 'fs';
import path from 'path';
import { ValidationError } from '../helpers/errors.helper';
import { formatLog } from '../helpers/logger.helper';

export class LogsService {
  // ACTIVITIES LOGS
  async fetchActivitiesLogs() {
    const logFilePath = path.join(__dirname, '/../../logs/activities.log');

    try {
      const logData = fs.readFileSync(logFilePath, 'utf-8');

      const logEntries = logData
        .trim()
        .split('}')
        .map((entry, index, arr) => {
          if (entry && index < arr.length - 1) {
            return entry + '}';
          }
        })
        ?.filter((entry) => entry !== undefined);
      return logEntries
        ?.map((entry) => {
          return formatLog(entry as string);
        })
        .sort(
          (a, b) =>
            new Date(
              (
                b as unknown as {
                  timestamp: Date;
                }
              ).timestamp
            ).getTime() -
            new Date(
              (
                a as unknown as {
                  timestamp: Date;
                }
              ).timestamp
            ).getTime()
        );
    } catch (err) {
      throw new ValidationError(err as string);
    }
  }

  // ERROR LOGS
  async fetchErrorLogs() {
    const logFilePath = path.join(__dirname, '/../../logs/error.log');

    try {
      const logData = fs.readFileSync(logFilePath, 'utf-8');

      const logEntries = logData
        .trim()
        .split('}')
        .map((entry, index, arr) => {
          if (entry && index < arr.length - 1) {
            return entry + '}';
          }
        })
        ?.filter((entry) => entry !== undefined);
      return logEntries?.map((entry) => {
        return formatLog(entry as string);
      });
    } catch (err) {
      throw new ValidationError(err as string);
    }
  }

  // CRITICAL LOGS
  async fetchCriticalLogs() {
    const logFilePath = path.join(__dirname, '/../../logs/critical.log');

    try {
      const logData = fs.readFileSync(logFilePath, 'utf-8');

      const logEntries = logData
        .trim()
        .split('}')
        .map((entry, index, arr) => {
          if (entry && index < arr.length - 1) {
            return entry + '}';
          }
        })
        ?.filter((entry) => entry !== undefined);
      return logEntries?.map((entry) => {
        return formatLog(entry as string);
      });
    } catch (err) {
      throw new ValidationError(err as string);
    }
  }
}
