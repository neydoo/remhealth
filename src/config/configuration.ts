export interface Configuration {
  env: string;
  emailPlatform: string;
  port: number;
  google: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
  sms?: {
    termii?: { url: string; key: string };
    smart?: { url: string; key: string };
  };
  ui: { url: string };
  email: {
    defaultSenderAddress: string;
    defaultSenderName: string;
    sparkpost?: {
      key: string;
    };
    mailgun: {
      key: string;
      domain: string;
    };
  };
  logger: { logLevel: string };
  loggly: {
    token: string;
    subdomain: string;
  };
  database: { url: string; test: string };
  cron: { weatherUpdateFrequency: string };
}

export default (): Configuration => ({
  env: process.env.NODE_ENV || 'development',
  ui: { url: '' },
  sms: { termii: { url: '', key: '' } },
  emailPlatform: 'mock',
  port: parseInt(process.env.PORT, 10) || 2001,
  email: {
    defaultSenderAddress: '',
    defaultSenderName: '',
    sparkpost: { key: '' },
    mailgun: { key: '', domain: '' },
  },
  google: {
    client_id: '',
    client_secret: '',
    redirect_uris: [],
  },
  logger: {
    logLevel: '',
  },
  loggly: {
    token: '',
    subdomain: '',
  },
  database: {
    url: process.env.DATABASE_URL,
    test: process.env.DATABASE_TEST,
  },
  cron: {
    weatherUpdateFrequency: process.env.WEATHER_FREQUENCY || '1',
  },
});
