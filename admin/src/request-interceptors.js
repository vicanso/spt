import request from 'axios';

request.interceptors.request.use(config => {
  if (!config.timeout) {
    config.timeout = 10 * 1000;
  }
  // eslint-disable-next-line
  config.url = `${URL_PREFIX}${config.url}`;
  return config;
});
