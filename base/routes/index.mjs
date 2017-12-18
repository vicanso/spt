import _ from 'lodash';

import sys from './system';
import i18n from './i18n';
import user from './user';

export default _.flatten([
  sys,
  i18n,
  user,
]);
