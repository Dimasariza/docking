import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/pages/home',
    home: true
  },
  {
    title: 'Project',
    icon: 'briefcase-outline',
    link: '/pages/project',
    home: true,
    data: {
      role: ['admin', 'superintendent', 'director']
    }
  },
  {
    title: 'Tender',
    icon: 'cube-outline',
    link: '/pages/tender',
    home: true,
    data: {
      role: ['admin', 'superintendent', 'director', 'shipyard']
    }
  },
  {
    title: 'Tracking',
    icon: 'search-outline',
    link: '/pages/tracking',
    home: true,
    data: {
      role: ['admin', 'superintendent', 'director', 'shipyard']
    }
  },
];
