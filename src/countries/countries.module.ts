import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COUNTRY, STATE } from '@rem/shared/constants/schema';
import { ResponseService } from '../shared/services/response.service';
import CountriesController from './controllers/countries.controller';
import { CountrySchema } from './schema/country.schema';
import { StateSchema } from './schema/state.schema';
import CountriesService from './services/countries.service';
import { StatesService } from './services/state.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: COUNTRY, schema: CountrySchema },
      { name: STATE, schema: StateSchema },
    ]),
  ],
  providers: [CountriesService, ResponseService, StatesService],
  controllers: [CountriesController],
  exports: [CountriesService],
})
export default class CountriesModule {}
