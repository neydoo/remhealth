import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COUNTRY } from '@rem/shared/constants/schema';
import { ResponseService } from '../shared/services/response.service';
import CountriesController from './controllers/countries.controller';
import { CountrySchema } from './schema/country.schema';
import CountriesService from './services/countries.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: COUNTRY, schema: CountrySchema }]),
  ],
  providers: [CountriesService, ResponseService],
  controllers: [CountriesController],
  exports: [CountriesService],
})
export default class CountriesModule {}
