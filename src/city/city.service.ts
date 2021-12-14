import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import configuration from 'src/config/configuration';
import { CITY } from 'src/shared/constants/schema';
import EntityExists from 'src/shared/errors/EntityExistsError';
import { WeatherDocument } from 'src/weather/weather.schema';
import { WeatherService } from 'src/weather/weather.service';
import { CityDocument } from './city.schema';

@Injectable()
export class CityService {
  @InjectModel(CITY)
  private cityModel: Model<CityDocument>;
  private weatherService: WeatherService;

  /** persist city record to db */
  async create(data: CityDocument): Promise<CityDocument> {
    const existingCity = await this.cityModel.findOne({ name: data.name });
    if (existingCity) {
      throw new EntityExists('city');
    }
    return this.cityModel.create(data);
  }

  /** get current weather info for a city and persist city record to db */
  async createNewCity(data: CityDocument): Promise<CityDocument> {
    const city = await this.create(data);
    const weather = await this.weatherService.getCurrentStats(city.name);
    city.weather = weather;
    return city;
  }

  /** delete a city and its weather info */
  async deleteCity(id: string): Promise<void> {
    const existingCity = await this.cityModel.findById(id);
    if (!existingCity) {
      throw new EntityExists(existingCity.id);
    }

    await this.deleteWeather(existingCity.id);
  }

  /** delete a city's weather info */
  async deleteWeather(id: string): Promise<void> {
    return this.weatherService.deleteWeather(id);
  }

  /** get a city's weather info
   * @param: city id
   */
  async getCityWeather(id: string): Promise<WeatherDocument> {
    return this.weatherService.getCityWeather(id);
  }

  /** get a city's info by id */
  async getCity(id: string): Promise<CityDocument> {
    return this.cityModel.findById(id);
  }

  /** get all city's info along with weather info */
  async getAllCities(): Promise<CityDocument[]> {
    return this.cityModel.find();
  }

  /** get a city using it's name */
  async getCityByName(
    name: string,
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
      return await this.weatherService.getCurrentStats(name);
    }
    return city;
  }

  async getAllCityLastKnownWeather(): Promise<CityDocument[]> {
    return this.cityModel.aggregate([
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
  }

  @Cron(`0 0-23/${configuration().cron.weatherUpdateFrequency} * * *`)
  async updateWeather(): Promise<void> {
    const cities = await this.cityModel.find();
    await this.weatherService.updateCityWeather(cities);
  }
}
