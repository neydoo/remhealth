import { Injectable } from '@nestjs/common';
import { Model, PaginateModel, Document, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import CreateCountryDto from '../dto/country.dto';
import { Country } from '../interfaces/country.interface';
import { COUNTRY } from 'src/shared/constants/schema';

type countryModel<T extends Document> = PaginateModel<T>;

@Injectable()
export default class CountriesService {
  constructor(
    @InjectModel(COUNTRY)
    private readonly country: Model<Country>,
    @InjectModel(COUNTRY)
    private readonly countryPaginated: countryModel<Country>,
  ) {}

  /**
   * Get all paginated countries
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
    return this.countryPaginated.paginate(query, {
      customLabels,
      offset,
      limit,
    });
  }

  /**
   * Get all countries
   * @param query
   */
  async all(): Promise<Country[]> {
    return this.country.find().sort({ name: 1 });
  }

  /**
   * Create country
   * @param createTransactionDto
   */
  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    createCountryDto.imageUrl = `https://flagcdn.com/64x48/${createCountryDto.iso2}.png`;
    const check = await this.country.findOne({ name: createCountryDto.name });
    if (check) {
      return this.country.findOneAndUpdate(
        { name: createCountryDto.name },
        createCountryDto,
        { new: true },
      );
    }
    // eslint-disable-next-line new-cap
    const country = new this.country(createCountryDto);

    return country.save();
  }

  async getOne(query: FilterQuery<Country> = {}): Promise<Country> {
    return this.country.findOne(query);
  }
}
