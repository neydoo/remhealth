import { Document } from 'mongoose';

export interface Country extends Document {
  areaCodes: string[];
  code: string;
  dialCode: string;
  iso2: string;
  imageUrl: string;
  name: string;
  priority: number;
  symbol: string;
  isActive: boolean;
  lastEditedBy: string;
}
