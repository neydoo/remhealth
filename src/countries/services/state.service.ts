import { Injectable } from '@nestjs/common';
import { Model, PaginateModel, Document, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { STATE } from '@rem/shared/constants/schema';
import { State, StateDocument } from 'countries/schema/state.schema';

type stateModel<T extends Document> = PaginateModel<T>;

@Injectable()
export class StatesService {
  constructor(
    @InjectModel(STATE)
    private readonly state: Model<StateDocument>,
    @InjectModel(STATE)
    private readonly statePaginated: stateModel<StateDocument>,
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
  async all(): Promise<StateDocument[]> {
    return this.state.find().sort({ name: 1 });
  }

  /**
   * Create state
   * @param createTransactionDto
   */
  async create(createStateDto: State): Promise<StateDocument> {
    const check = await this.state.findOne({ name: createStateDto.name });
    if (check) {
      return this.state.findOneAndUpdate(
        { name: createStateDto.name },
        createStateDto,
        { new: true },
      );
    }
    // eslint-disable-next-line new-cap
    const state = await this.state.create(createStateDto);

    return state;
  }

  // async getOne(query: FilterQuery<State> = {}): Promise<StateDocument> {
  //   return this.state.findOne(query);
  // }
}
