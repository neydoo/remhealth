import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';
import ExternalService from 'src/shared/external/request';
import { Logger } from 'winston';

@Injectable()
export default class SlackService extends ExternalService {
  constructor() {
    super();
  }

  async send(
    text: string,
    channel: string,
    attachments?: unknown,
  ): Promise<any> {
    const webhookUrl = configuration().slack.url;
    // const { isDev } = configuration();

    return this.post(webhookUrl, {
      text,
      username: 'isBot',
      icon_emoji: ':curiousrick:',
      channel,
      // channel: isDev() ? 'dev-payments' : channel,
      attachments,
    });
  }

  async sendSafe(
    payload: {
      text: string;
      channel: string;
      attachments?: unknown;
      ctx?: Record<string, unknown>;
    },
    logger: Logger,
  ): Promise<void> {
    try {
      await this.send(payload.text, payload.channel, payload.attachments);
    } catch (error) {
      logger.error(
        `error sending slack notification - ${error.message}`,
        payload.ctx,
      );
    }
  }
}
