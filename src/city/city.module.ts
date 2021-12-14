import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CITY } from 'src/shared/constants/schema';
import { CityService } from './city.service';
import { CitySchema } from './city.schema';
import { CityController } from './city.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: CITY, schema: CitySchema }])],
  providers: [CityService],
  controllers: [CityController],
})
export class CityModule {}
