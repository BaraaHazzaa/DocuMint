import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItemButton,
  Collapse,
  useTheme,
  styled,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  PostAdd as PostAddIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import CanAccess from '../common/CanAccess';
import { useTranslation } from 'react-i18next';

const NAV_WIDTH = 280;

const navConfig = [
  {
    title: 'الرئيسية',
    path: '/dashboard',
    icon: <DashboardIcon />,
    allowedRoles: ['employee', 'manager', 'admin', 'executive'],
  },
  {
    title: 'معاملة جديدة',
    path: '/transaction/new',
    icon: <PostAddIcon />,
    allowedRoles: ['employee'],
  },
  {
    title: 'الإدارة',
    icon: <SettingsIcon />,
    allowedRoles: ['admin', 'manager', 'executive'],
    children: [
      {
        title: 'إدارة المستخدمين',
        path: '/admin/users',
        icon: <PeopleIcon />,
        allowedRoles: ['admin'],
      },
      {
        title: 'التقارير',
        path: '/reports',
        icon: <AssessmentIcon />,
        allowedRoles: ['manager', 'executive', 'admin'],
      },
    ],
  },
];

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH}px)`,
  },
}));

function NavItem({ item, open, onMenuClick }) {
  const { title, path, icon, children } = item;
  const [openSub, setOpenSub] = useState(false);

  const handleClick = () => {
    if (children) {
      setOpenSub((prev) => !prev);
    } else if (path) {
      onMenuClick(path);
    }
  };

  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ py: 1.5, px: 2.5 }}>
        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
        <ListItemText primary={title} sx={{ opacity: open ? 1 : 0 }} />
        {children && (open ? (openSub ? <ExpandLess /> : <ExpandMore />) : null)}
      </ListItemButton>
      {children && (
        <Collapse in={open && openSub} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((child) => (
              <CanAccess key={child.title} allowedRoles={child.allowedRoles}>
                <NavItem item={child} open={open} onMenuClick={onMenuClick} />
              </CanAccess>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const theme = useTheme();
  const { t } = useTranslation();

  const [openNav, setOpenNav] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/login');
  };

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleNavigation = (path) => navigate(path);

  const renderNavContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        DocuMint
      </Typography>
      <List component="nav">
        {navConfig.map((item) => (
          <CanAccess key={item.title} allowedRoles={item.allowedRoles}>
            <NavItem item={item} open={openNav} onMenuClick={handleNavigation} />
          </CanAccess>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            onClick={() => setOpenNav(!openNav)}
            sx={{ mr: 1, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleMenu}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => handleNavigation('/profile')}>
              <AccountCircleIcon sx={{ mr: 1 }} />
              {user?.name}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              {t('navbar.logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </StyledAppBar>

      <Box
        component="nav"
        sx={{ width: { lg: openNav ? NAV_WIDTH : 0 }, flexShrink: { lg: 0 } }}
      >
        <Drawer
          variant="permanent"
          open={openNav}
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              width: NAV_WIDTH,
              boxSizing: 'border-box',
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {renderNavContent}
        </Drawer>
      </Box>
    </>
  );
}