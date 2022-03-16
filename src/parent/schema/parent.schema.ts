import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseSchemaDecorator } from '../../shared/decorators/base_schema.decorator';
import { CountryDocument } from 'countries/schema/country.schema';
import { StateDocument } from 'countries/schema/state.schema';

export type ParentDocument = Parent & Document;

@BaseSchemaDecorator()
export class Parent {
  @ApiProperty({ description: "parent's email" })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'phonenumber of parent' })
  @Prop({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'country id' })
  @Prop({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
  })
  country: string | CountryDocument;

  @ApiProperty({ description: 'state id' })
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  state: string | StateDocument;
}

const ParentSchema = SchemaFactory.createForClass(Parent);

export { ParentSchema };
