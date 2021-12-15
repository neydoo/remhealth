import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { CITY } from '../shared/constants/schema';
import {
  rootMongooseTestModule,
  mockRepository,
  closeInMongodConnection,
} from '../../test/mongo-config';
import { LoggerModule } from '../logger/logger.module';
import { City, CityDocument, CitySchema } from './city.schema';
import { CityService } from './city.service';
import { WeatherModule } from '../weather/weather.module';
import { OpenMapService } from '../weather/open-map.service';

describe('CityService', () => {
  let service: CityService;

  const openMapService = {
    getLiveWeatherInfo: () => ({
      weather: [{}],
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WeatherModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: CITY, schema: CitySchema }]),
      ],
      providers: [
        CityService,
        LoggerModule,
        {
          provide: getModelToken(CITY),
          useValue: mockRepository,
        },
      ],
    })
      .overrideProvider(OpenMapService)
      .useValue(openMapService)
      .compile();

    service = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a city', async () => {
    const createNewCity = jest.spyOn(service, 'createNewCity');
    const city = new City() as CityDocument;
    city.id = new Types.ObjectId();

    jest.spyOn(service, 'create').mockImplementation(async () => city);
    await service.createNewCity(city);

    expect(createNewCity).toHaveBeenCalledWith(city);
    expect(createNewCity).toReturn();
  });

  it('should get a city information', async () => {
    const getCity = jest.spyOn(service, 'getCity');
    const city = new City() as CityDocument;
    city.id = new Types.ObjectId();
    await service.getCity(city.id);
    expect(getCity).toHaveBeenCalledWith(city.id);
  });

  it('should delete  a city', async () => {
    const deleteCity = jest.spyOn(service, 'deleteCity');
    const city = new City() as CityDocument;
    city.id = new Types.ObjectId();
    await service.deleteCity(city.id);
    expect(deleteCity).toHaveBeenCalledWith(city.id);
  });

  it('should get weather information for all cities', async () => {
    const getAllCitiesLiveWeather = jest.spyOn(
      service,
      'getAllCitiesLiveWeather',
    );

    await service.getAllCitiesLiveWeather();
    expect(getAllCitiesLiveWeather).toHaveBeenCalledWith();
    expect(getAllCitiesLiveWeather).toReturn();
  });

  it('should get weather information for a city by name', async () => {
    const getCityByName = jest.spyOn(service, 'getCityByName');

    await service.getCityByName('Paris');
    expect(getCityByName).toHaveBeenCalledWith('Paris');
  });

  it('should get get the latest live weather information for all cities', async () => {
    const updateWeather = jest.spyOn(service, 'updateWeather');

    await service.updateWeather();
    expect(updateWeather).toHaveBeenCalled();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
