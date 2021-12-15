import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CITY } from '../shared/constants/schema';
import { CityService } from './city.service';
import { CitySchema } from './city.schema';
import { CityController } from './city.controller';
import { ResponseService } from '../shared/services/response.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CITY, schema: CitySchema }]),
    WeatherModule,
  ],
  providers: [CityService, ResponseService],
  controllers: [CityController],
})
export class CityModule {}
