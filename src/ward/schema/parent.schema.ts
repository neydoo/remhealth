import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseSchemaDecorator } from '../../shared/decorators/base_schema.decorator';
import { CountryDocument } from 'countries/schema/country.schema';
import { StateDocument } from 'countries/schema/state.schema';

export type ParentDocument = Parent & Document;

@BaseSchemaDecorator()
export class Parent {
  @ApiProperty({ description: 'first name of the child' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'last name of the child' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'other names of the child' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  country: string | CountryDocument;

  @ApiProperty({ description: 'dob of the child' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  state: string | StateDocument;
}

const ParentSchema = SchemaFactory.createForClass(Parent);

export { ParentSchema };
