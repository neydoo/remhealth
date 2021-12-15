import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { Logger } from 'winston';
import config from '../config/configuration';

@Injectable()
export class OpenMapService {
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
  async getLiveWeatherInfo(city: string, logger?: Logger) {
    const options = { ...this.axiosConfig };
    options.url += 'weather';
    options.params = { ...options.params, q: city };

    logger?.info(`fetching real time weather info for ${city}`);
    const res = await axios(options);
    return res.data;
  }
}
