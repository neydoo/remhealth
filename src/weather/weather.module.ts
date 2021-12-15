import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WEATHER } from '../shared/constants/schema';
import { WeatherSchema } from './weather.schema';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WEATHER, schema: WeatherSchema }]),
  ],
  exports: [WeatherService],
  providers: [WeatherService],
})
export class WeatherModule {}
