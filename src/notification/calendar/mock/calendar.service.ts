import { Inject } from '@nestjs/common';
import { LOGGER } from '@rem/shared/constants/schema';
import { Logger } from 'winston';

import CalendarService from '../calendar.interface';

export class MockService implements CalendarService {
  constructor(@Inject(LOGGER) private logger: Logger) {}

  async setupCalendar(message: string, number: string): Promise<void> {
    this.logger.info(`sending mock sms with message ${message} to ${number}`);
  }
}
