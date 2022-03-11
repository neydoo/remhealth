import { Provider } from '@nestjs/common';

import { Logger, createLogger, format, transports } from 'winston';
import configuration from '../config/configuration';
import { LOGGER } from '../shared/constants/schema';

export const loggerProviders: Provider[] = [
  {
    provide: LOGGER,
    useFactory: (): Logger => {
      const { logLevel } = configuration().logger;
      const logger = createLogger({
        level: logLevel,
        format: format.json(),
        defaultMeta: {
          product: 'RemHealth',
        },
      });
      const { env } = configuration();

      if (env === 'development') {
        logger.add(
          new transports.Console({
            format: format.simple(),
          }),
        );
      } else {
        // add production config
      }

      return logger;
    },
  },
];
