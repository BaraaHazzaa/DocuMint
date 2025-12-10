import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  NotificationsOutlined,
  AccountCircle,
  Menu as MenuIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { notifications, unreadCount } = useNotifications();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuAnchor(null);
  };

  const handleNavigation = (path) => {
    handleCloseMobileMenu();
    handleCloseMenu();
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="fixed" 
      dir="rtl"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        {isMobile && user ? (
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleMobileMenu}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        ) : null}
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: isMobile ? '1rem' : '1.25rem',
            fontWeight: 600
          }}
        >
          نظام المعاملات الإلكترونية
        </Typography>

        {user && !isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              color={isActive('/dashboard') ? 'primary' : 'inherit'}
              onClick={() => handleNavigation('/dashboard')}
              startIcon={<HomeIcon />}
            >
              الرئيسية
            </Button>
            <Button
              color={isActive('/transactions/new') ? 'primary' : 'inherit'}
              onClick={() => handleNavigation('/transactions/new')}
            >
              معاملة جديدة
            </Button>
            <IconButton
              color="inherit"
              onClick={() => handleNavigation('/notifications')}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsOutlined />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleMenu}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={() => handleNavigation('/profile')}>
            الملف الشخصي
          </MenuItem>
          <MenuItem onClick={handleLogout}>تسجيل خروج</MenuItem>
        </Menu>

        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleCloseMobileMenu}
        >
          <MenuItem onClick={() => handleNavigation('/dashboard')}>
            الرئيسية
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/transactions/new')}>
            معاملة جديدة
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/notifications')}>
            الإشعارات
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/profile')}>
            الملف الشخصي
          </MenuItem>
          <MenuItem onClick={handleLogout}>تسجيل خروج</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}