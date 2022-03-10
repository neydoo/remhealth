import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WARD } from 'src/shared/constants/schema';
import { Ward, WardDocument } from './schema/ward.schema';

@Injectable()
export class WardService {
  constructor(
    @InjectModel(WARD)
    private wardModel: Model<WardDocument>,
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
}
