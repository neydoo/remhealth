import { Module } from '@nestjs/common';
import { Logger } from 'winston';

import { SparkpostService } from './email/sparkpost/spartkpost.service';
import { MockService } from './email/mock/mock.service';
import { EmailService } from './email';
import { EmailTemplateEngine } from './email/template.service';
import { EMAIL_SERVICE, LOGGER } from '@rem/shared/constants/schema';
import configuration from '@rem/config/configuration';
import { MailGunService } from './email/mailgun/mail.service';
import GoogleService from './calendar/google/calendar.service';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  providers: [
    {
      provide: EMAIL_SERVICE,
      useFactory: (logger: Logger): EmailService => {
        switch (configuration().emailPlatform) {
          case 'mock':
            logger.info('using mock email service');
            return new MockService(logger);
          case 'sparkpost':
            logger.info('using sparkpost email service');
            return new SparkpostService();
        }

        logger.info('using sparkpost email service');
        return new MailGunService();
      },
      inject: [LOGGER],
    },
    EmailTemplateEngine,
    GoogleService,
    NotificationService,
  ],
  exports: [
    EMAIL_SERVICE,
    EmailTemplateEngine,
    GoogleService,
    NotificationService,
  ],
})
export class NotificationModule {}
