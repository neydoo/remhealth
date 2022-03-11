import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WARD } from '@rem/shared/constants/schema';
import { Ward, WardDocument } from './schema/ward.schema';
import GoogleService from '@rem/notification/calendar/google/calendar.service';
import { VaccineService } from '@rem/vaccine/vaccine.service';
import { UtilService } from '@rem/shared/services/util.service';

@Injectable()
export class WardService {
  constructor(
    @InjectModel(WARD)
    private wardModel: Model<WardDocument>,
    private googleService: GoogleService,
    private vaccineService: VaccineService,
    private utilService: UtilService,
  ) {}

  async addWard(Ward: Ward): Promise<void> {
    await this.wardModel.create(Ward);
  }

  async countWard(): Promise<number> {
    return this.wardModel.count();
  }

  async findWardWards(parent: string): Promise<WardDocument[]> {
    return this.wardModel.find({ parent });
  }

  async setupGoogleCalendar(code: string): Promise<void> {
    const vaccines = await this.vaccineService.getAllVaccines();
    const groupedVaccines = this.utilService.group(vaccines, 'day');

    await this.googleService.createEvents(code);
  }
}
