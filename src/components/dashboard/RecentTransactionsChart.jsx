import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

const RecentTransactionsChart = ({ data, loading }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t('dashboard.chart.title')}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        {loading ? (
          <Typography>{t('dashboard.chart.loading')}</Typography>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill={theme.palette.primary.main} name={t('dashboard.chart.completed')} />
            <Bar dataKey="pending" fill={theme.palette.secondary.main} name={t('dashboard.chart.pending')} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Paper>
  );
};

export default RecentTransactionsChart;
