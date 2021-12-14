import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import { Model } from 'mongoose';
import { CityDocument } from 'src/city/city.schema';
import { WEATHER } from 'src/shared/constants/schema';
import config from '../config/configuration';
import { WeatherDocument } from './weather.schema';

@Injectable()
export class WeatherService {
  @InjectModel(WEATHER)
  private weatherModel: Model<WeatherDocument>;
  protected axiosConfig: AxiosRequestConfig;
  constructor() {
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
  async getCurrentStats(city: string) {
    const options = { ...this.axiosConfig };
    options.url += 'weather';
    options.params = { ...options.params, q: city };

    const res = await axios(options);
    return res.data;
  }

  /** delete a city's weather info */
  async deleteWeather(city: string): Promise<void> {
    await this.weatherModel.deleteMany({ city });
  }

  /** save a city's weather info */
  async saveWeather(city: string, data: Record<string, unknown>) {
    const weatherInfo = await this.weatherModel.findOne({ city });

    if (weatherInfo) {
      weatherInfo.data = data;
      return weatherInfo.save();
    }
    return this.weatherModel.create({ city, data });
  }

  /** get a city's weather info */
  async getCityWeather(city: string) {
    return await this.weatherModel.findOne({ city });
  }

  /** fetch and update latest weather info for cities */
  async updateCityWeather(cities: CityDocument[]) {
    // get all cities, and fetch weather information for each city
    cities.forEach(async (city) => {
      const { weather } = await this.getCurrentStats(city.name);
      await this.saveWeather(city.id, weather);
    });
  }
}
