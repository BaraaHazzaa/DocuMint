import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
  AssignmentTurnedIn,
  HourglassEmpty,
  People,
  Warning,
} from '@mui/icons-material';
import StatWidget from '../dashboard/StatWidget';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import TransactionsList from '../transactions/TransactionsList';
import WelcomeHeader from '../dashboard/WelcomeHeader';
import RecentTransactionsChart from '../dashboard/RecentTransactionsChart';
import { useTranslation } from 'react-i18next';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, chartData] = await Promise.all([
          dashboardService.getStats(user.role),
          dashboardService.getChartData(user.role),
        ]);
        setStats(statsData);
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchData();
    }
  }, [user]);

  const widgets = [
    { title: t('dashboard.manager.pending_approval'), value: stats.pendingApproval, icon: <HourglassEmpty />, color: 'warning' },
    { title: t('dashboard.manager.team_completed'), value: stats.teamCompleted, icon: <AssignmentTurnedIn />, color: 'success' },
    { title: t('dashboard.manager.overdue'), value: stats.overdue, icon: <Warning />, color: 'error' },
    { title: t('dashboard.manager.team_members'), value: stats.totalTeam, icon: <People />, color: 'info' },
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
          <RecentTransactionsChart data={chartData} loading={loading} />
        </Grid>
        <Grid item xs={12}>
          <TransactionsList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;
