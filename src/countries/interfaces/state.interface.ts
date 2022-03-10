import { Document } from 'mongoose';

export interface State extends Document {
  name: string;
  code: string;
}
