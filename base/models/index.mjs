import _ from 'lodash';

import setting from './setting';
import mock from './mock';

import customModels from '../../models';

export default _.extend({
  setting,
  mock,
}, customModels);
