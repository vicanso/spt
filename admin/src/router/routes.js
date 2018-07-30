import Setting from '../views/setting';
import Register from '../views/register';
import Login from '../views/login';
import Mock from '../views/mock';
import Tracker from '../views/tracker';
import RouteLimiter from '../views/route-limiter';

export const Routes = {
  Register: 'register',
  Login: 'login',
  Setting: 'setting',
  Mock: 'mock',
  Tracker: 'tracker',
  RouteLimiter: 'route-limiter',
};

export default [
  {
    name: Routes.Register,
    path: '/register',
    component: Register,
  },
  {
    name: Routes.Setting,
    path: '/setting',
    component: Setting,
  },
  {
    name: Routes.Login,
    path: '/login',
    component: Login,
  },
  {
    name: Routes.Mock,
    path: '/mock',
    component: Mock,
  },
  {
    name: Routes.Tracker,
    path: '/tracker',
    component: Tracker,
  },
  {
    name: Routes.RouteLimiter,
    path: '/route-limiter',
    component: RouteLimiter,
  },
];
