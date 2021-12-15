import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import { Model } from 'mongoose';
import { Logger } from 'winston';

import { CityDocument } from '../city/city.schema';
import { WEATHER } from '../shared/constants/schema';
import { OpenMapService } from './open-map.service';
import { WeatherDocument } from './weather.schema';

@Injectable()
export class WeatherService {
  protected axiosConfig: AxiosRequestConfig;
  constructor(
    @InjectModel(WEATHER)
    private readonly weatherModel: Model<WeatherDocument>,
    private openMapService: OpenMapService,
  ) {}

  /** get a city's weather info */
  async getCurrentStats(city: string, logger?: Logger) {
    return this.openMapService.getLiveWeatherInfo(city, logger);
  }

  /** delete a city's weather info */
  async deleteWeather(city: string, logger?: Logger): Promise<void> {
    logger?.info(`removing weather info for ${city}`);
    await this.weatherModel.deleteMany({ city });
  }

  /** get a  new city's weather info */
  async getCityWeatherInfo(
    city: CityDocument,
    logger?: Logger,
  ): Promise<Record<string, unknown>> {
    const { weather } = await this.getCurrentStats(city.name, logger);
    await this.saveWeather(city.id, weather[0], logger);
    return weather;
  }

  /** save a city's weather info */
  async saveWeather(
    city: string,
    data: Record<string, unknown>,
    logger?: Logger,
  ) {
    const weatherInfo = await this.weatherModel.findOne({ city });

    if (weatherInfo) {
      logger?.info('updating existing weather record', weatherInfo.id);
      weatherInfo.weather = data;
      await this.weatherModel.updateOne(
        { _id: weatherInfo.id },
        { weather: data },
      );
      return weatherInfo;
    }
    logger?.info('creating new weather record');
    const weather = await this.weatherModel.create({ city, weather: data });
    return weather;
  }

  /** fetch and update latest weather info for cities */
  async getCitiesLiveWeather(
    cities: CityDocument[],
    update?: boolean,
    logger?: Logger,
  ): Promise<CityDocument[]> {
    // get all cities, and fetch weather information for each city
    if (!cities.length) {
      return;
    }
    const cityPromise = await Promise.all(
      cities.map(async (city) => {
        const weatherInfo = await this.getCurrentStats(city.name);
        city.weather = weatherInfo;
        if (update) {
          logger?.info(`updating weather info for ${city.id}`);
          await this.saveWeather(city.id, weatherInfo.weather);
        }
        return city;
      }),
    );
    return cityPromise;
  }
}
