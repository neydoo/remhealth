import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import configuration from '../config/configuration';
import { CITY } from '../shared/constants/schema';
import EntityExists from '../shared/errors/EntityExistsError';
import NotFoundError from '../shared/errors/NotFoundError';
import { WeatherService } from '../weather/weather.service';
import { Logger } from 'winston';
import { City, CityDocument } from './city.schema';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(CITY)
    private cityModel: Model<CityDocument>,
    private weatherService: WeatherService,
  ) {}

  /** persist city record to db */
  async create(data: City, logger?: Logger): Promise<CityDocument> {
    const existingCity = await this.cityModel.findOne({ name: data.name });
    if (existingCity) {
      logger?.warning(`city with ${data.name} already exists`);
      throw new EntityExists('city');
    }
    return this.cityModel.create(data);
  }

  /** get current weather info for a city and persist city record to db */
  async createNewCity(data: City, logger?: Logger): Promise<CityDocument> {
    const city = await this.create(data, logger);
    const weather = await this.weatherService.getCityWeatherInfo(city, logger);
    city.weather = weather;
    return city;
  }

  /** delete a city and its weather info */
  async deleteCity(id: string, logger?: Logger): Promise<void> {
    const existingCity = await this.cityModel.findById(id);
    if (!existingCity) {
      logger?.warning(`city with ${id} not found`);
      throw new NotFoundError(id);
    }
    logger?.info(`deleting city record for ${id}`);
    await this.cityModel.findByIdAndRemove(id);
    await this.deleteWeather(existingCity.id, logger);
  }

  /** delete a city's weather info */
  async deleteWeather(id: string, logger?: Logger): Promise<void> {
    logger?.info(`deleting weather record for city ${id}`);
    return this.weatherService.deleteWeather(id);
  }

  /** get a city's info by id */
  async getCity(id: string, logger?: Logger): Promise<CityDocument> {
    logger?.info(`get record for city ${id}`);
    return this.cityModel.findById(id);
  }

  /** get all city's info along with weather info */
  async getAllCities(logger?: Logger): Promise<CityDocument[]> {
    logger?.info(`get record for all cities`);
    return this.cityModel.find();
  }

  /** get all cities live weather info */
  async getAllCitiesLiveWeather(logger?: Logger): Promise<CityDocument[]> {
    const cities = await this.getAllCities(logger);
    return await this.weatherService.getCitiesLiveWeather(
      cities,
      false,
      logger,
    );
  }

  /** get a city using it's name */
  async getCityByName(
    name: string,
    logger?: Logger,
  ): Promise<CityDocument | Record<string, unknown>> {
    const [city] = await this.cityModel.aggregate([
      {
        $match: {
          name: {
            $regex: RegExp(name, 'i'),
          },
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'weather',
          as: 'weather',
          let: {
            cityId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$city', '$$cityId'],
                    },
                  ],
                },
              },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$weather',
          preserveNullAndEmptyArrays: false,
        },
      },
    ]);

    if (!city) {
      return await this.weatherService.getCurrentStats(name, logger);
    }
    logger?.info(`fetched record for city ${name}`);
    return city;
  }

  @Cron(`0 0-23/${configuration().cron.weatherUpdateFrequency} * * *`)
  async updateWeather(): Promise<void> {
    const cities = await this.cityModel.find();
    await this.weatherService.getCitiesLiveWeather(cities, true);
  }
}
