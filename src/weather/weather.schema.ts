import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CITY } from 'src/shared/constants/schema';
import { City } from 'src/city/city.schema';

export type WeatherDocument = Weather & Document;

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
  data: Record<string, unknown>;

  @Prop({
    type: SchemaTypes.Boolean,
    default: false,
  })
  isDeleted?: boolean;

  @Prop()
  deletedAt?: Date;
}

const WeatherSchema = SchemaFactory.createForClass(Weather);

export { WeatherSchema };
