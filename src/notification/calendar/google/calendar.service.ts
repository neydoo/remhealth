import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

import configuration from '@rem/config/configuration';
import { ParentDocument } from 'parent/schema/parent.schema';

@Injectable()
export default class GoogleService {
  protected googleAuth;

  constructor() {
    const { client_secret, client_id, redirect_uris } = configuration().google;
    this.googleAuth = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );
  }

  async createEvents(code: string, event: any): Promise<void> {
    const token = await this.googleAuth.getToken(code);

    this.googleAuth.setCredentials(token);

    const calendar = google.calendar({ version: 'v3', auth: this.googleAuth });

    const googleEvent = await calendar.events.insert({
      auth: this.googleAuth,
      calendarId: 'primary',
      requestBody: event,
    });

    console.log('Event created: %s', googleEvent.data.htmlLink);
  }

  async generateAuthUrl(parent: ParentDocument) {
    const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
    const authUrl = await this.googleAuth.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: { parent: parent.id },
    });
    return authUrl;
  }

  async getAccessToken(code: string) {
    const token = await this.googleAuth.getToken(code);

    return token;
  }
}
