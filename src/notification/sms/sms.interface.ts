import { Logger } from 'winston';

export default interface SmsService {
  sendSms(message: string, number: string, logger?: Logger): Promise<void>;
}
