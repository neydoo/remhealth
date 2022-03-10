import { Mail } from './types';

export interface EmailService {
  sendMail(mail: Mail): Promise<void>;
}
