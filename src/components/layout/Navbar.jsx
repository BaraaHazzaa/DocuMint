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
import CanAccess from '../common/CanAccess';

const navLinks = [
  {
    label: 'الرئيسية',
    path: '/dashboard',
    icon: <HomeIcon />,
    allowedRoles: ['employee', 'manager', 'admin', 'executive'],
  },
  {
    label: 'معاملة جديدة',
    path: '/transaction/new',
    allowedRoles: ['employee'],
  },
  {
    label: 'إدارة المستخدمين',
    path: '/admin/users',
    allowedRoles: ['admin'],
  },
  {
    label: 'التقارير',
    path: '/reports',
    allowedRoles: ['manager', 'executive', 'admin'],
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { notifications: _notifications, unreadCount } = useNotifications();
  
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

  const renderNavLinks = (isMobileMenu = false) =>
    navLinks.map((link) => (
      <CanAccess key={link.path} allowedRoles={link.allowedRoles}>
        {isMobileMenu ? (
          <MenuItem onClick={() => handleNavigation(link.path)}>
            {link.label}
          </MenuItem>
        ) : (
          <Button
            color={isActive(link.path) ? 'primary' : 'inherit'}
            onClick={() => handleNavigation(link.path)}
            startIcon={link.icon}
          >
            {link.label}
          </Button>
        )}
      </CanAccess>
    ));


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
            {renderNavLinks()}
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
          {renderNavLinks(true)}
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