import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

import configuration from '@rem/config/configuration';

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

  async createEvents(code: string): Promise<void> {
    const token = await this.googleAuth.getToken(code);

    this.googleAuth.setCredentials(token);

    const calendar = google.calendar({ version: 'v3', auth: this.googleAuth });
    const event = {
      summary: 'Google I/O 2015',
      location: '800 Howard St., San Francisco, CA 94103',
      description: "A chance to hear more about Google's developer products.",
      start: {
        dateTime: '2015-05-28T09:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: '2015-05-28T17:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
      recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
      attendees: [
        { email: 'lpage@example.com' },
        { email: 'sbrin@example.com' },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    calendar.events.insert(
      {
        auth: this.googleAuth,
        calendarId: 'primary',
        requestBody: event,
      },
      function (err, event) {
        if (err) {
          console.log(
            'There was an error contacting the Calendar service: ' + err,
          );
          return;
        }
        console.log('Event created: %s', event.htmlLink);
      },
    );

    // this.google.
  }
}
