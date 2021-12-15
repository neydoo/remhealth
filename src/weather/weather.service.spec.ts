/* eslint-disable @typescript-eslint/no-empty-function */
import { Model, Types } from 'mongoose';

import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../logger/logger.module';
import { City, CityDocument } from '../city/city.schema';
import { WeatherService } from './weather.service';
import { Weather, WeatherDocument, WeatherSchema } from './weather.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { WEATHER } from '../shared/constants/schema';

import {
  closeInMongodConnection,
  mockRepository,
  rootMongooseTestModule,
} from '../../test/mongo-config';
import { OpenMapService } from './open-map.service';

describe('WeatherService', () => {
  let service: WeatherService;
  const openMapService = {
    getLiveWeatherInfo: () => ({}),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: WEATHER, schema: WeatherSchema }]),
      ],
      providers: [
        WeatherService,
        LoggerModule,
        {
          provide: getModelToken(Weather.name),
          useValue: mockRepository,
        },
      ],
    })
      .overrideProvider(OpenMapService)
      .useValue(openMapService)
      .compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete weather information for a city', async () => {
    const deleteWeather = jest.spyOn(service, 'deleteWeather');
    const city = new City() as CityDocument;
    city.id = new Types.ObjectId();
    await service.deleteWeather(city.id);
    expect(deleteWeather).toHaveBeenCalledWith(city.id);
  });

  it('should get saved weather information for a city', async () => {
    const getCityWeatherInfo = jest.spyOn(service, 'getCityWeatherInfo');
    const city = new City() as CityDocument;
    city.id = new Types.ObjectId();
    await service.getCityWeatherInfo(city as CityDocument);
    expect(getCityWeatherInfo).toHaveBeenCalledWith(city.id);
  });

  it('should save weather information for a city', async () => {
    const saveWeather = jest.spyOn(service, 'saveWeather');
    const city = new City() as CityDocument;
    city.id = new Types.ObjectId();

    await service.saveWeather(city.id, {});
    expect(saveWeather).toHaveBeenCalledWith(city.id, {});
    expect(saveWeather).toReturn();
  });

  it('should get live weather information for a city', async () => {
    const getCurrentStats = jest.spyOn(service, 'getCurrentStats');
    const city = new City();
    await service.getCitiesLiveWeather([city] as CityDocument[]);
    expect(getCurrentStats).toHaveBeenCalled();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
