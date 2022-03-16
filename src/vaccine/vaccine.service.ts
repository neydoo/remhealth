import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VACCINE } from '@rem/shared/constants/schema';
import { Model } from 'mongoose';
import { VaccineDocument } from './schema/vaccine.schema';

@Injectable()
export class VaccineService {
  constructor(
    @InjectModel(VACCINE)
    private vaccineModel: Model<VaccineDocument>,
  ) {}

  async getAllVaccines(): Promise<VaccineDocument[]> {
    return this.vaccineModel.find();
  }
}
