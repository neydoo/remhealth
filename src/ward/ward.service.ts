import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PARENT } from 'src/shared/constants/schema';
import { Parent, ParentDocument } from './schema/Parent.schema';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(PARENT)
    private ParentModel: Model<ParentDocument>,
  ) {}

  async addParent(Parent: Parent): Promise<void> {
    await this.ParentModel.create(Parent);
  }

  async countParent(): Promise<number> {
    return this.ParentModel.count();
  }

  async findParentParents(parent: string): Promise<ParentDocument[]> {
    return this.ParentModel.find({ parent });
  }
}
