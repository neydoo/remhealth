import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

import { cloneDeep } from 'lodash';
import configuration from '../../../config/configuration';
import { SmsData } from '../types';

@Injectable()
export default class TermiiService {
  protected termiiOptions: AxiosRequestConfig;

  constructor() {
    this.termiiOptions = {
      method: 'POST',
      url: configuration().sms.termii.url,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async sendSms(message: string, number: string): Promise<void> {
    // const parsedNumber = this.utilService.parsePhonenumber(number);
    const data: SmsData = {
      to: number,
      from: 'N-Alert', // using Bento doesn't send to numbers on dnd
      sms: message,
      type: 'plain',
      channel: 'dnd',
      api_key: configuration().sms.termii.key as string,
    };

    const options = cloneDeep(this.termiiOptions);
    options.url += 'sms/send';

    options.data = data;
    await axios(options);
  }
}
