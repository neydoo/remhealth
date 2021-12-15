import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { CITY } from '../shared/constants/schema';
import { City } from '../city/city.schema';
import { BaseSchemaDecorator } from '../shared/decorators/base_schema.decorator';

export type WeatherDocument = Weather & Document;

@BaseSchemaDecorator()
export class Weather {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: CITY,
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  city: string | City;

  @Prop({
    type: Object,
  })
  weather: Record<string, unknown>;
}

const WeatherSchema = SchemaFactory.createForClass(Weather);

export { WeatherSchema };
