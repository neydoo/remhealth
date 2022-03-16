import { ApiProperty } from '@nestjs/swagger';
import { Parent } from 'parent/schema/parent.schema';
import { Ward } from 'ward/schema/ward.schema';

export enum StatusCode {
  Success = 200,
  Created = 201,
  Failure = 400,
  Conflict = 409,
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Unknwon = 'unknown',
  None = 'none',
}

export enum NotificationType {
  Email = 'email',
  SMS = 'sms',
  Google = 'google',
}

export class RegisterWard {
  @ApiProperty({ description: 'dob of the child' })
  dob: Date;
  @ApiProperty({ description: 'first name of the child' })
  firstName: string;
  @ApiProperty({ description: 'last name of the child' })
  lastName: string;
  @ApiProperty({ description: 'other names of the child' })
  otherName: string;
  @ApiProperty({ description: "parent's email" })
  email: string;
  @ApiProperty({ description: 'phonenumber of parent' })
  phone: string;
  @ApiProperty({ description: 'state id' })
  state: string;
  @ApiProperty({ description: 'country id' })
  country: string;
}

export const Genders = Object.values(Gender);
export const NotificationTypes = Object.values(NotificationType);
