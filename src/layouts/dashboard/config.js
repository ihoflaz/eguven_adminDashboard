import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import BuildingOffice2Icon from '@heroicons/react/24/solid/BuildingOffice2Icon';
import { SvgIcon } from '@mui/material';

export const baseItems = [
  {
    title: 'Genel Bakış',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Kullanıcılar',
    path: '/users',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    permission: 'user:read'
  },
  {
    title: 'Siparişler',
    path: '/esigns',
    icon: (
      <SvgIcon fontSize="small">
        <ListBulletIcon />
      </SvgIcon>
    ),
    permission: 'order:read'
  },
  {
    title: 'Şirketler',
    path: '/company',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingOffice2Icon />
      </SvgIcon>
    ),
    permission: 'company:read'
  }
];
