import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import CountriesService from '@centdb/country/services/countries.service';
import { Country } from '@centdb/country/interfaces/country.interface';
import configuration from '@centdb/config/configuration';
import { SCHEMAS } from '@centdb/core/constants';
import { CountrySchema } from '../schema/country.schema';
import CountriesController from './countries.controller';

describe('CountriesController', () => {
  let controller: CountriesController;

  let service: CountriesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(configuration().database.testUrl, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([
          { name: SCHEMAS.COUNTRY, schema: CountrySchema },
        ]),
      ],
      controllers: [CountriesController],
      providers: [CountriesService],
    }).compile();

    service = moduleRef.get<CountriesService>(CountriesService);
    controller = moduleRef.get<CountriesController>(CountriesController);
  });

  describe('all', async () => {
    it('should return an array of cats', async () => {
      const result: Country[] = [];
      jest.spyOn(service, 'all').mockImplementation();

      expect(await controller.all()).toBe(result);
    });
  });
});
