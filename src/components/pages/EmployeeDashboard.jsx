import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
  CheckCircleOutline,
  Drafts,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';
import StatWidget from '../dashboard/StatWidget';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import DraftsList from './DraftsList';
import WelcomeHeader from '../dashboard/WelcomeHeader';
import { useTranslation } from 'react-i18next';

const EmployeeDashboard = () => {
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
    { title: t('dashboard.employee.pending'), value: stats.pending, icon: <HourglassEmpty />, color: 'warning' },
    { title: t('dashboard.employee.approved'), value: stats.approved, icon: <CheckCircleOutline />, color: 'success' },
    { title: t('dashboard.employee.rejected'), value: stats.rejected, icon: <Cancel />, color: 'error' },
    { title: t('dashboard.employee.drafts'), value: stats.drafts, icon: <Drafts />, color: 'info' },
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
