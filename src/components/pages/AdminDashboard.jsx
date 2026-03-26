import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
  People,
  ReceiptLong,
  ErrorOutline,
  Dns,
} from '@mui/icons-material';
import SectionHeader from '../common/SectionHeader';
import StatWidget from '../dashboard/StatWidget';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
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
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers,
      icon: <People fontSize="large" />,
    },
    {
      title: 'إجمالي المعاملات',
      value: stats.totalTransactions,
      icon: <ReceiptLong fontSize="large" />,
    },
    {
      title: 'أخطاء النظام',
      value: stats.systemErrors,
      icon: <ErrorOutline fontSize="large" />,
    },
    {
      title: 'الجلسات النشطة',
      value: stats.activeSessions,
      icon: <Dns fontSize="large" />,
    },
  ];

  return (
    <Box>
      <SectionHeader
        title="لوحة تحكم المسؤول"
        subtitle="إدارة النظام والمستخدمين"
      />
      <Grid container spacing={3}>
        {widgets.map((widget, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatWidget
              loading={loading}
              title={widget.title}
              value={widget.value}
              icon={widget.icon}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
