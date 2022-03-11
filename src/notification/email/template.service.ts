import { Inject } from '@nestjs/common';
import { configure, Environment } from 'nunjucks';
import { join } from 'path';
// import * as moment from 'moment';
import { Logger } from 'winston';
import { EmailService } from './email.interface';
import { Address, Mail } from '.';
import { ResetPayload } from './template.types';
import configuration from '@rem/config/configuration';
import { EMAIL_SERVICE, LOGGER } from '@rem/shared/constants/schema';

export class EmailTemplateEngine {
  private engine: Environment;

  private base: string;

  constructor(
    @Inject(EMAIL_SERVICE) private emailService: EmailService,
    @Inject(LOGGER) private logger: Logger,
  ) {
    const path = join(__dirname, '../../../', 'templates');
    this.engine = configure(path, { autoescape: true });
    this.base = configuration().ui.url;
    this.initTemplateEngine();
  }

  initTemplateEngine(): void {
    this.engine.addFilter('displayDate', (value, format) => {
      // if (!moment(value).isValid()) return value;
      // return UtilService.formatDate(value, format);
    });
    this.engine.addFilter('fullname', (value) => {
      if (!value) return '';
      return `${value.firstname} ${value.lastname}`;
    });
    this.engine.addFilter('location', (value) => {
      if (!value) return '';
      return `${value.address}, ${value.school}, ${value.state}, ${value.country}`;
    });
  }

  async sendResetPasswordMail(
    recipient: string,
    payload: ResetPayload,
  ): Promise<void> {
    const mail = new Mail();
    const to = new Address(recipient, payload.name);
    mail.to = [to];
    mail.subject = 'Password Reset';

    const uiUrl = this.base;

    const link = `${uiUrl}/reset-password?token=${payload.token}`;
    const body = this.engine.render('password-reset.njk', {
      link,
      name: payload.name,
    });
    mail.body = body;
    await this.emailService.sendMail(mail);
  }
}
