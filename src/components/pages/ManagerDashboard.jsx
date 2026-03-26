import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
  AssignmentTurnedIn,
  HourglassEmpty,
  People,
  Warning,
} from '@mui/icons-material';
import SectionHeader from '../common/SectionHeader';
import StatWidget from '../dashboard/StatWidget';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import TransactionsList from '../transactions/TransactionsList';

const ManagerDashboard = () => {
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
      title: 'معاملات بانتظار الموافقة',
      value: stats.pendingApproval,
      icon: <HourglassEmpty fontSize="large" />,
    },
    {
      title: 'معاملات مكتملة للفريق',
      value: stats.teamCompleted,
      icon: <AssignmentTurnedIn fontSize="large" />,
    },
    {
      title: 'معاملات متأخرة',
      value: stats.overdue,
      icon: <Warning fontSize="large" />,
    },
    {
      title: 'أعضاء الفريق',
      value: stats.totalTeam,
      icon: <People fontSize="large" />,
    },
  ];

  return (
    <Box>
      <SectionHeader
        title="لوحة تحكم المدير"
        subtitle="مراجعة واعتماد المعاملات"
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
          <TransactionsList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;
