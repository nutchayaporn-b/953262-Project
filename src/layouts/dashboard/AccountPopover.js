import { useRef, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import MenuPopover from '../../components/MenuPopover';
import { useAuth } from '../../context/AuthContext';
//
import account from '../../_mocks_/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '#',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '#',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { user, logout } = useAuth();

  if (user.role !== 'guest')
    return (
      <>
        <IconButton
          ref={anchorRef}
          onClick={handleOpen}
          sx={{
            padding: 0,
            width: 44,
            height: 44,
            ...(open && {
              '&:before': {
                zIndex: 1,
                content: "''",
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: theme => alpha(theme.palette.grey[900], 0.72),
              },
            }),
          }}
        >
          <Avatar src={account.photoURL} alt="photoURL" />
        </IconButton>

        <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 220 }}>
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle1" noWrap>
              {user.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {user.email}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {MENU_OPTIONS.map(option => (
            <MenuItem
              key={option.label}
              to={option.linkTo}
              component={RouterLink}
              onClick={handleClose}
              sx={{ typography: 'body2', py: 1, px: 2.5 }}
            >
              <Iconify
                icon={option.icon}
                sx={{
                  mr: 2,
                  width: 24,
                  height: 24,
                }}
              />

              {option.label}
            </MenuItem>
          ))}

          <Box sx={{ p: 2, pt: 1.5 }}>
            <Button
              fullWidth
              color="inherit"
              variant="outlined"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Logout
            </Button>
          </Box>
        </MenuPopover>
      </>
    );

  return (
    <>
      <button
        className="text-gray-600 font-bold bg-green-400 font-xl px-4 py-2 rounded-xl"
        onClick={() => navigate('/auth/login')}
      >
        Sign In
      </button>
      <button
        className="text-gray-600 font-bold bg-green-400 font-xl px-4 py-2 rounded-xl"
        onClick={() => navigate('/auth/register')}
      >
        Sign Up
      </button>
    </>
  );
}
