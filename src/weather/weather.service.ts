import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import { Model, ObjectId } from 'mongoose';
import { Logger } from 'winston';

import { CityDocument } from '../city/city.schema';
import { WEATHER } from '../shared/constants/schema';
import config from '../config/configuration';
import { WeatherDocument } from './weather.schema';

@Injectable()
export class WeatherService {
  protected axiosConfig: AxiosRequestConfig;
  constructor(
    @InjectModel(WEATHER)
    private readonly weatherModel: Model<WeatherDocument>,
  ) {
    this.axiosConfig = {
      method: 'GET',
      url: config().openMapApi.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        appid: config().openMapApi.key,
      },
    };
  }

  /** get a city's weather info */
  async getCurrentStats(city: string, logger?: Logger) {
    const options = { ...this.axiosConfig };
    options.url += 'weather';
    options.params = { ...options.params, q: city };

    logger?.info(`fetching real time weather info for ${city}`);
    const res = await axios(options);
    return res.data;
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
      return weatherInfo.save();
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
