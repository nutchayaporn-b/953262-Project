import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';

import { useAuth } from '../../context/AuthContext';

import Iconify from '../../components/Iconify';
// ----------------------------------------------------------------------

const getIcon = name => <Iconify icon={name} width={22} height={22} />;

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { user, login } = useAuth();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const sidebarConfig =
    user.role === 'customer' || user.role === 'guest'
      ? [
          {
            title: 'dashboard',
            path: '/dashboard',
            icon: getIcon('eva:pie-chart-2-fill'),
          },
          {
            title: 'Order',
            path: '/customer/order',
            icon: getIcon('ep:dish'),
          },
          {
            title: 'Checkout',
            path: '/customer/checkout',
            icon: getIcon('eva:file-text-fill'),
          },
        ]
      : [
          {
            title: 'dashboard',
            path: '/dashboard',
            icon: getIcon('eva:pie-chart-2-fill'),
          },
          {
            title: 'Order Management',
            path: '/kitchen/order',
            icon: getIcon('ep:dish'),
          },
          {
            title: 'Payment Management',
            path: '/kitchen/payment',
            icon: getIcon('eva:file-text-fill'),
          },
        ];

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
            <Box sx={{ ml: 2 }} onClick={() => login()}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {user?.name || 'Guest'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user?.role || ''}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={sidebarConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}></Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle className="">
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
