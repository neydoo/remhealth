import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { WARD } from '@rem/shared/constants/schema';
import { Ward, WardDocument } from './schema/ward.schema';
import GoogleService from '@rem/notification/calendar/google/calendar.service';
import { VaccineService } from '@rem/vaccine/vaccine.service';
import { UtilService } from '@rem/shared/services/util.service';
import { ParentDocument } from 'parent/schema/parent.schema';
import { CountryDocument } from 'countries/schema/country.schema';
import { NotificationType } from '@rem/shared/types';
import { NotificationService } from '@rem/notification/notification.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class WardService {
  constructor(
    @InjectModel(WARD)
    private wardModel: Model<WardDocument>,
    private notificationService: NotificationService,
    private googleService: GoogleService,
    private vaccineService: VaccineService,
    private utilService: UtilService,
  ) {}

  async addWard(ward: Ward): Promise<void> {
    await this.wardModel.create(ward);
  }

  async countWard(): Promise<number> {
    return this.wardModel.count();
  }

  async findParentWards(parent: string): Promise<WardDocument[]> {
    return this.wardModel.find({ parent });
  }

  async setupGoogleCalendar(
    code: string,
    ward: WardDocument,
    parent: ParentDocument,
  ): Promise<void> {
    const { timeZone } = parent.country as CountryDocument;
    const vaccines = await this.vaccineService.getAllVaccines();
    const groupedVaccines = await this.utilService.group(vaccines, 'due');
    const days = Object.values(groupedVaccines);

    days.map((vac) => {
      const date = dayjs(ward.dob).add(vac[0].due, 'day').format();

      // might need to shorten the names if they become too long
      const vaccineNames = vac.map((v) => v.name);
      const event = {
        summary: `It is ${ward.firstName}'s immunization day!! `,
        location: 'Nearest PHC',
        description: `${ward.firstName} is due for ${vaccineNames.join(',')} ${
          vac.length > 1 ? 'vaccines' : 'vaccine'
        }. Please visit the nearest PHC`,
        start: {
          date,
          timeZone,
        },
        end: {
          date,
          timeZone,
        },
        recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
        attendees: [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };
      this.googleService.createEvents(code, event);
    });
  }

  // kicks in everyday by 9:20 am
  @Cron(`20 9 * * *`)
  async sendDueVaccinationReminder(
    daysBeforeDueDate: number,
    type: NotificationType,
  ) {
    const vaccines = await this.vaccineService.getAllVaccines();

    const groupedVaccines = await this.utilService.group(vaccines, 'due');
    const vacs = Object.values(groupedVaccines);
    const maxDay = Math.max(
      ...Object.keys(groupedVaccines).map((i) => Number(i)),
    );

    const maxDate = dayjs()
      .subtract(maxDay - daysBeforeDueDate)
      .format();

    // get all wards that fall within the range of available vaccines

    const wards = await this.wardModel
      .find({ dob: { $gte: new Date(maxDate) } })
      .populate('parent');

    vacs.map((vac) => {
      const dueDate = dayjs().add(daysBeforeDueDate).format();
      const dueWards: WardDocument[] = wards.filter(
        (ward) => dayjs(ward.dob).add(vac[0].due).format() === dueDate,
      );

      dueWards.map((ward) => {
        this.notificationService.sendReminderNoification(
          ward,
          daysBeforeDueDate,
          type,
          vac,
        );
      });
    });
  }
}
