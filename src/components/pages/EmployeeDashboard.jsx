import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
  CheckCircleOutline,
  Drafts,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';
import SectionHeader from '../common/SectionHeader';
import StatWidget from '../dashboard/StatWidget';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import DraftsList from './DraftsList';

const EmployeeDashboard = () => {
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
      title: 'معاملات قيد الانتظار',
      value: stats.pending,
      icon: <HourglassEmpty fontSize="large" />,
    },
    {
      title: 'معاملات موافق عليها',
      value: stats.approved,
      icon: <CheckCircleOutline fontSize="large" />,
    },
    {
      title: 'معاملات مرفوضة',
      value: stats.rejected,
      icon: <Cancel fontSize="large" />,
    },
    {
      title: 'المسودات',
      value: stats.drafts,
      icon: <Drafts fontSize="large" />,
    },
  ];

  return (
    <Box>
      <SectionHeader
        title="لوحة تحكم الموظف"
        subtitle="إدارة وتتبع معاملاتك"
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
        <Grid item xs={12}>
          <DraftsList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;
