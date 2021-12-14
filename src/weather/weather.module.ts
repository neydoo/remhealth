import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WEATHER } from 'src/shared/constants/schema';
import { WeatherController } from './weather.controller';
import { WeatherSchema } from './weather.schema';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WEATHER, schema: WeatherSchema }]),
  ],
  controllers: [WeatherController],
  exports: [WeatherService],
  providers: [WeatherService],
})
export class WeatherModule {}
