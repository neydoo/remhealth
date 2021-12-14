export interface Configuration {
  env: string;
  port: number;
  openMapApi: {
    baseUrl: string;
    key: string;
  };
  logger: { logLevel: string };
  loggly: {
    token: string;
    subdomain: string;
  };
  database: { url: string };
  cron: { weatherUpdateFrequency: string };
}

export default (): Configuration => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 2001,
  openMapApi: {
    baseUrl: process.env.OPENMAP_API_URL,
    key: process.env.OPENMAP_API_KEY,
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
  },
  cron: {
    weatherUpdateFrequency: process.env.WEATHER_FREQUENCY || '1',
  },
});
