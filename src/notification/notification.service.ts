import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_SERVICE } from '@rem/shared/constants/schema';
import { NotificationType } from '@rem/shared/types';
import { VaccineDocument } from '@rem/vaccine/schema/vaccine.schema';
import { ParentDocument } from 'parent/schema/parent.schema';
import { WardDocument } from 'ward/schema/ward.schema';
import GoogleService from './calendar/google/calendar.service';
import { Mail, Address, EmailService } from './email';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(EMAIL_SERVICE)
    private emailService: EmailService,
    private googleService: GoogleService,
  ) {}

  async sendReminderNoification(
    ward: WardDocument,
    days: number,
    type: NotificationType,
    vaccines: VaccineDocument[],
  ): Promise<void> {
    const { parent } = ward;
    const { email, phone } = parent as ParentDocument;
    const vaccineNames = vaccines.map((v) => v.name);
    const body = ` Hi there, <br>
        Trust you're having a good day! <br>
        A reminder that ${ward.firstName} is due for ${vaccineNames.join(
      ',',
    )} ${
      vaccines.length > 1 ? 'vaccines' : 'vaccine'
    }.<br> Please visit the nearest PHC.
        `;
    const mail: Mail = {
      to: new Address(email, ''),
      subject: ` ${ward.firstName}'s immunization is in ${days} days`,
      body,
    };

    switch (type) {
      case NotificationType.Email:
        // send email to parent
        this.emailService.sendMail(mail);
        break;

      case NotificationType.SMS:
        // send sms to parent
        break;

      default:
        break;
    }
  }

  async sendGoogleAuthEmail(parent: ParentDocument): Promise<void> {
    const url = await this.googleService.generateAuthUrl(parent);
    const { email } = parent;
    const body = ` Hi there, <br>
        Trust you're having a good day! <br>
        Pease use this <a href="${url}">link</a> to give us access to your google calendar.
        `;
    const mail: Mail = {
      to: new Address(email, ''),
      subject: `Google Calendar`,
      body,
    };
    await this.emailService.sendMail(mail);
  }
}
