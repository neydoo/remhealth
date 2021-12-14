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

  /** get a  new city's weather info */
  async getNewCityWeatherInfo(
    city: CityDocument,
  ): Promise<Record<string, unknown>> {
    const { weather } = await this.getCurrentStats(city.name);
    await this.saveWeather(city.id, weather[0]);
    return weather;
  }

  /** save a city's weather info */
  async saveWeather(city: string, data: Record<string, unknown>) {
    const weatherInfo = await this.weatherModel.findOne({ city });

    if (weatherInfo) {
      weatherInfo.weather = data;
      console.log({ weatherInfo, city, data });
      return weatherInfo.save();
    }
    const weather = await this.weatherModel.create({ city, weather: data });
    console.log({ weatherInfo, city, data, weather });
    return weather;
  }

  /** fetch and update latest weather info for cities */
  async getCitiesLiveWeather(
    cities: CityDocument[],
    update?: boolean,
  ): Promise<CityDocument[]> {
    // get all cities, and fetch weather information for each city
    const cityPromise = await Promise.all(
      cities.map(async (city) => {
        const weatherInfo = await this.getCurrentStats(city.name);
        city.weather = weatherInfo;
        if (update) {
          await this.saveWeather(city.id, weatherInfo.weather);
        }
        return city;
      }),
    );
    return cityPromise;
  }
}
