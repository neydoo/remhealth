import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PARENT } from '@rem/shared/constants/schema';
import { ParentDocument, Parent } from './schema/parent.schema';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(PARENT)
    private parentModel: Model<ParentDocument>,
  ) {}

  async addParent(parent: Parent): Promise<ParentDocument> {
    return this.parentModel.create(parent);
  }

  async countParent(): Promise<number> {
    return this.parentModel.count();
  }

  async findParentParents(parent: string): Promise<ParentDocument[]> {
    return this.parentModel.find({ parent });
  }
}
