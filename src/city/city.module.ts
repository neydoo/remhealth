import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CITY } from 'src/shared/constants/schema';
import { CityService } from './city.service';
import { CitySchema } from './city.schema';
import { CityController } from './city.controller';
import { ResponseService } from 'src/shared/services/response.service';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CITY, schema: CitySchema }]),
    WeatherModule,
  ],
  providers: [CityService, ResponseService],
  controllers: [CityController],
})
export class CityModule {}
