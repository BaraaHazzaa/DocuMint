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
import { Paper, Typography, useTheme, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const RecentTransactionsChart = ({ data, loading }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 3, mt: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {t('dashboard.chart.title')}
      </Typography>
      <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {loading ? (
            <Typography>{t('dashboard.chart.loading')}</Typography>
          ) : (
            <BarChart data={data} barCategoryGap="20%" barGap={4}>
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
              <Bar dataKey="completed" fill={theme.palette.primary.main} name={t('dashboard.chart.completed')} maxBarSize={60} />
              <Bar dataKey="pending" fill={theme.palette.secondary.main} name={t('dashboard.chart.pending')} maxBarSize={60} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default RecentTransactionsChart;
