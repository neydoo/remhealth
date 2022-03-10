import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseSchemaDecorator } from '../../shared/decorators/base_schema.decorator';

export type WardDocument = Ward & Document;

@BaseSchemaDecorator()
export class Ward {
  @ApiProperty({ description: 'first name of the child' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'last name of the child' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'other names of the child' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  otherName: string;

  @ApiProperty({ description: 'dob of the child' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  dob: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  parent: string;
}

const WardSchema = SchemaFactory.createForClass(Ward);

export { WardSchema };
