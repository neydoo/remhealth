import { Module } from '@nestjs/common';
import { Logger } from 'winston';

import { SparkpostService } from './email/sparkpost/spartkpost.service';
import { MockService } from './email/mock/mock.service';
import { EmailService } from './email';
import SlackService from './slack/slack.service';
import { EmailTemplateEngine } from './email/template.service';
import { EMAIL_SERVICE, LOGGER } from 'src/shared/constants/schema';
import configuration from 'src/config/configuration';

@Module({
  imports: [],
  providers: [
    {
      provide: EMAIL_SERVICE,
      useFactory: (logger: Logger): EmailService => {
        if (configuration().enableMockEmail) {
          logger.info('using mock email service');
          return new MockService(logger);
        }

        logger.info('using sparkpost email service');
        return new SparkpostService();
      },
      inject: [LOGGER],
    },
    EmailTemplateEngine,
    SlackService,
  ],
  exports: [EMAIL_SERVICE, EmailTemplateEngine, SlackService],
})
export class NotificationModule {}
