import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SectionHeader from '../common/SectionHeader';
import toast from 'react-hot-toast';
// import { reportService } from '../../services/reportService'; // This service will need to be created

const Reports = () => {
  const [reportType, setReportType] = useState('pdf');
  const [reportContent, setReportContent] = useState('transaction_summary');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('يرجى تحديد تاريخ البدء والانتهاء');
      return;
    }
    if (startDate > endDate) {
      toast.error('تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء');
      return;
    }

    setLoading(true);
    try {
      // const response = await reportService.generateReport({
      //   reportType,
      //   reportContent,
      //   startDate,
      //   endDate,
      // });

      // Mock response for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This would typically trigger a file download
      toast.success('جاري إنشاء التقرير...');

    } catch {
      toast.error('فشل إنشاء التقرير');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }} dir="rtl">
      <SectionHeader
        title="إنشاء التقارير"
        subtitle="قم بتحديد خيارات التقرير المطلوب"
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="تاريخ البدء"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="تاريخ الانتهاء"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="نوع التقرير"
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
            >
              <MenuItem value="transaction_summary">ملخص المعاملات</MenuItem>
              <MenuItem value="user_activity">نشاط المستخدمين</MenuItem>
              <MenuItem value="overdue_transactions">المعاملات المتأخرة</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="تنسيق الملف"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              disabled={loading}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Paper>
  );
};

export default Reports;
