import { Injectable } from '@nestjs/common';
import { Model, PaginateModel, Document, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { State } from '../interfaces/state.interface';
import { COUNTRY } from '@rem/shared/constants/schema';

type stateModel<T extends Document> = PaginateModel<T>;

@Injectable()
export default class StatesService {
  constructor(
    @InjectModel(COUNTRY)
    private readonly state: Model<State>,
    @InjectModel(COUNTRY)
    private readonly statePaginated: stateModel<State>,
  ) {}

  /**
   * Get all paginated states
   * @param query
   */
  async index(query: any = {}, offset = 0, limit = 10): Promise<any> {
    const customLabels = {
      docs: 'nodes',
      page: 'currentPage',
      totalPages: 'pageCount',
      limit: 'perPage',
      totalDocs: 'itemCount',
    };
    return this.statePaginated.paginate(query, {
      customLabels,
      offset,
      limit,
    });
  }

  /**
   * Get all states
   * @param query
   */
  async all(): Promise<State[]> {
    return this.state.find().sort({ name: 1 });
  }

  /**
   * Create state
   * @param createTransactionDto
   */
  async create(createStateDto: State): Promise<State> {
    const check = await this.state.findOne({ name: createStateDto.name });
    if (check) {
      return this.state.findOneAndUpdate(
        { name: createStateDto.name },
        createStateDto,
        { new: true },
      );
    }
    // eslint-disable-next-line new-cap
    const state = new this.state(createStateDto);

    return state.save();
  }

  async getOne(query: FilterQuery<State> = {}): Promise<State> {
    return this.state.findOne(query);
  }
}
