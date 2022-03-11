import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseSchemaDecorator } from '../../shared/decorators/base_schema.decorator';
import { Gender, Genders } from '@rem/shared/types';

export type VaccineDocument = Vaccine & Document;

@BaseSchemaDecorator()
export class Vaccine {
  @ApiProperty({ description: 'name of the vaccine' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'days after birth before vaccine is due' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  due: number;

  @ApiProperty({ description: 'other names of the child' })
  @Prop({
    required: true,
    default: false,
  })
  @IsBoolean()
  genderOriented: boolean;

  @ApiProperty({ description: 'dob of the child' })
  @Prop({
    required: false,
    default: Gender.None,
    enum: Genders,
  })
  @IsString()
  gender: Gender;
}

const VaccineSchema = SchemaFactory.createForClass(Vaccine);

export { VaccineSchema };
