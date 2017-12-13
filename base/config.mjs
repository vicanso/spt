import pkg from '../package';

export const port = Number.parseInt(process.env.PORT, 10) || 5018;

export const env = process.env.NODE_ENV || 'development';

// eslint-disable-next-line
export const version = pkg.version;

export const app = pkg.name;

// eslint-disable-next-line
export const httpLogFommat = ':account :request-id :method :url :status :length :response-time ms ":referrer"';

export const trackCookie = 'jt';

export const appUrlPrefix = '/api';

// logger setting "console", "udp://127.0.0.1:5001"
export const logger = process.env.LOG;

// mongodb connection uri
export const mongoUri = process.env.MONGO || 'mongodb://127.0.0.1/spt';

// redis connection uri
export const redisUri = process.env.REDIS || 'redis://127.0.0.1/';
