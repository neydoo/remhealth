import { Inject } from '@nestjs/common';
import { LOGGER } from 'src/shared/constants/schema';
import { Logger } from 'winston';

import SmsService from '../sms.interface';

export class MockService implements SmsService {
  constructor(@Inject(LOGGER) private logger: Logger) {}

  async sendSms(message: string, number: string): Promise<void> {
    this.logger.info(`sending mock sms with message ${message} to ${number}`);
  }
}
