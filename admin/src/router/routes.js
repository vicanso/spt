import Setting from '../views/setting';
import Register from '../views/register';
import Login from '../views/login';

export default [
  {
    name: 'register',
    path: '/register',
    component: Register,
  },
  {
    name: 'setting',
    path: '/setting',
    component: Setting,
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
  },
];
