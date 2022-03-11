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

export const Genders = Object.values(Gender);
