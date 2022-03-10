import { Inject } from '@nestjs/common';
import { LOGGER } from '../../../shared/constants/schema';

import { Logger } from 'winston';
import { EmailService } from '../email.interface';
import { Mail } from '../types';

export class MockService implements EmailService {
  constructor(@Inject(LOGGER) private logger: Logger) {}

  async sendMail(mail: Mail): Promise<void> {
    this.logger.info(
      `sending mock email with subject ${mail.subject} to ${mail.to[0].email}`,
    );
  }
}
