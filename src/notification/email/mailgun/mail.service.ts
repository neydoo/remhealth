import Mailgun from 'mailgun.js';
import formData from 'form-data';
import Client from 'mailgun.js/client';

import { EmailService } from '../email.interface';
import { Mail, Address } from '../types';
import configuration from '@rem/config/configuration';

const DOMAIN = configuration().email.mailgun.domain;

export class MailGunService implements EmailService {
  private client: Client;

  private defaultSender: Address;

  constructor() {
    const mailgun = new Mailgun(formData);
    this.client = mailgun.client({
      username: 'api',
      key: configuration().email.mailgun.key,
    });

    this.defaultSender = new Address(
      configuration().email.defaultSenderAddress,
      configuration().email.defaultSenderName,
    );
  }

  async sendMail(mail: Mail): Promise<void> {
    const { to, from, subject, body, attachments } = mail;
    const sender =
      from || `${this.defaultSender.name} <${this.defaultSender.email}>`;

    const messageData = {
      from: sender,
      to,
      subject,
      text: body,
      html: body,
      attachments,
    };

    await this.client.messages.create(DOMAIN, messageData);
  }
}
