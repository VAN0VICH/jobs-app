import { routeUtil } from 'utils';

import create from './actions/create';
import get from './actions/get';
import list from './actions/list';
import remove from './actions/remove';
import update from './actions/update';

const publicRoutes = routeUtil.getRoutes([list, update, remove, create, get]);

const privateRoutes = routeUtil.getRoutes([]);

const adminRoutes = routeUtil.getRoutes([]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
