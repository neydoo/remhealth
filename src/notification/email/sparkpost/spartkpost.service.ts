import * as Sparkpost from 'sparkpost';
import { isEmpty } from 'lodash';

import { EmailService } from '../email.interface';
import { Mail, Address } from '../types';
import configuration from '@rem/config/configuration';

export class SparkpostService implements EmailService {
  private client: Sparkpost;

  private defaultSender: Address;

  constructor() {
    this.client = new Sparkpost(configuration().email.sparkpost.key);

    this.defaultSender = new Address(
      configuration().email.defaultSenderAddress,
      configuration().email.defaultSenderName,
    );
  }

  async sendMail(mail: Mail): Promise<void> {
    const sender = mail.from || this.defaultSender; 

    const transmission: Sparkpost.CreateTransmission = {
      content: {
        from: {
          name: sender.name,
          email: sender.email,
        },

        subject: mail.subject,
        html: mail.body,
      },
    };

    // transmission.recipients = mail.to.map((recipient) => ({
    //   address: {
    //     name: recipient.name,
    //     email: recipient.email,
    //   },
    // }));

    if (!isEmpty(mail.cc)) {
      transmission.cc = mail.cc.map((cc) => ({
        address: {
          name: cc.name,
          email: cc.email,
        },
      }));
    }

    if (!isEmpty(mail.attachments)) {
      (transmission.content as any).attachments = mail.attachments.map((a) => ({
        name: a.filename,
        type: a.mimeType,
        data: a.data,
      }));
    }

    await this.client.transmissions.send(transmission);
  }
}
