import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Button,
  Paper,
  ClickAwayListener,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/images/ecommerce-logo.png';

interface IUser {
  image_url?: string;
}

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header = ({ sidebarOpen, onToggleSidebar }: HeaderProps) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
  const profileImage = user?.image_url;

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/signin';
  };

  const handleProfileClick = () => {
    navigate('/seller-dashboard/profile');
    setShowOptions(false);
  };

  const toggleDropdown = () => {
    setShowOptions((prev) => !prev);
  };

  const closeDropdown = () => {
    setShowOptions(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#1976d2',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleSidebar}
            sx={{ mr: 2 }}
          >
            {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <img
            src={logo}
            alt="E-commerce Logo"
            style={{ height: 40, width: 'auto', marginRight: 8 }}
          />
          <Typography variant="h6" noWrap color="#fff">
            Seller Dashboard
          </Typography>
        </Box>

        <ClickAwayListener onClickAway={closeDropdown}>
          <Box position="relative">
            <Button
              onClick={toggleDropdown}
              sx={{ display: 'flex', alignItems: 'center', color: '#fff' }}
              startIcon={
                <Avatar
                  alt="User"
                  src={profileImage || ''}
                  sx={{ width: 32, height: 32 }}
                >
                  {!profileImage && <AccountCircleIcon />}
                </Avatar>
              }
              endIcon={<ArrowDropDownIcon />}
            />

            {showOptions && (
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  minWidth: 150,
                  zIndex: 10,
                }}
              >
                <Button
                  onClick={handleProfileClick}
                  sx={{ justifyContent: 'flex-start', px: 2 }}
                  startIcon={<AccountCircleIcon />}
                  fullWidth
                >
                  Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  sx={{ justifyContent: 'flex-start', px: 2 }}
                  startIcon={<LogoutIcon />}
                  fullWidth
                >
                  Logout
                </Button>
              </Paper>
            )}
          </Box>
        </ClickAwayListener>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
