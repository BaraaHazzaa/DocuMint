import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
  People,
  ReceiptLong,
  ErrorOutline,
  Dns,
  AdminPanelSettings, // Import icon
} from '@mui/icons-material';
import StatWidget from '../dashboard/StatWidget';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import WelcomeHeader from '../dashboard/WelcomeHeader';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // Import Link

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats(user.role);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchStats();
    }
  }, [user]);

  const widgets = [
    { title: t('dashboard.admin.total_users'), value: stats.totalUsers, icon: <People />, color: 'primary' },
    { title: t('dashboard.admin.total_transactions'), value: stats.totalTransactions, icon: <ReceiptLong />, color: 'secondary' },
    { title: t('dashboard.admin.system_errors'), value: stats.systemErrors, icon: <ErrorOutline />, color: 'error' },
    { title: t('dashboard.admin.active_sessions'), value: stats.activeSessions, icon: <Dns />, color: 'warning' },
    { 
      title: t('dashboard.admin.user_management'), 
      value: 'Manage', 
      icon: <People />, 
      color: 'info',
      link: '/admin/users' 
    },
    { 
      title: t('dashboard.admin.permissions_management'), 
      value: 'Settings', 
      icon: <AdminPanelSettings />, 
      color: 'success',
      link: '/admin/permissions'
    },
  ];

  return (
    <Box>
      <WelcomeHeader />
      <Grid container spacing={3}>
        {widgets.map((widget, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatWidget
              loading={loading}
              title={widget.title}
              value={widget.value}
              icon={widget.icon}
              color={widget.color}
              link={widget.link} // Pass link to StatWidget
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
