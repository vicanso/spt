import _ from 'lodash';

import sys from './system';
import custom from '../../routes';

export default _.flatten([
  sys,
  custom,
]);
