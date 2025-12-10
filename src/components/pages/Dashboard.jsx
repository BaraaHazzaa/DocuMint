import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
  CircularProgress,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [notifications, _setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', role: '' });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await transactionService.getTransactions(filters);
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="lg" className="container" dir="rtl">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          لوحة التحكم
        </Typography>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  في انتظار الموافقة
                </Typography>
                <Typography variant="h4" component="div">
                  {transactions.filter(t => t.status === 'pending').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  قيد المراجعة
                </Typography>
                <Typography variant="h4" component="div">
                  {transactions.filter(t => t.status === 'in_review').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  تم الموافقة
                </Typography>
                <Typography variant="h4" component="div" color="success.main">
                  {transactions.filter(t => t.status === 'approved').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  المرفوضة
                </Typography>
                <Typography variant="h4" component="div" color="error.main">
                  {transactions.filter(t => t.status === 'rejected').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            label="الحالة"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            sx={{ width: { xs: '100%', sm: '200px' }, mb: { xs: 2, sm: 0 } }}
          >
            <MenuItem value="">الكل</MenuItem>
            <MenuItem value="pending">قيد الانتظار</MenuItem>
            <MenuItem value="approved">مقبول</MenuItem>
            <MenuItem value="denied">مرفوض</MenuItem>
          </TextField>
          <TextField
            select
            label="الدور"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            sx={{ width: { xs: '100%', sm: '200px' }, mb: { xs: 2, sm: 0 } }}
          >
            <MenuItem value="">الكل</MenuItem>
            <MenuItem value="initiator">المبادر</MenuItem>
            <MenuItem value="manager">المدير</MenuItem>
            <MenuItem value="vice_manager">نائب المدير</MenuItem>
            <MenuItem value="director">المدير العام</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/transactions/new')}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            إنشاء معاملة جديدة
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {transactions.map((transaction) => (
            <Grid item xs={12} sm={6} md={4} key={transaction.id}>
              <Card className="card">
                <CardHeader
                  avatar={<Avatar>{transaction.title.charAt(0)}</Avatar>}
                  title={transaction.title}
                  subheader={`الحالة: ${transaction.status}`}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {transaction.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/transactions/${transaction.id}`)}
                  >
                    عرض التفاصيل
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">الإشعارات الأخيرة</Typography>
        <List>
          {notifications.slice(0, 3).map((notification) => (
            <ListItem key={notification.id}>
              <ListItemText
                primary={notification.message}
                secondary={new Date(notification.timestamp).toLocaleString('ar-SY')}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}