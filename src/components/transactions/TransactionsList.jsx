import { useState, useEffect } from 'react';
import { Box, Paper, Chip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../services/api';
import DataTable from '../common/DataTable';
import { Visibility } from '@mui/icons-material';
import SectionHeader from '../common/SectionHeader';

const getStatusChipColor = (status) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const TransactionsList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Assuming the service and API support pagination
        const response = await transactionService.getTransactions({
          ...paginationModel,
        });
        setRows(response.data); // Assuming API returns { data: [], total: number }
        setRowCount(response.total);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        // Handle error display in UI
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [paginationModel]);

  const columns = [
    { field: 'id', headerName: 'رقم المعاملة', width: 120 },
    { field: 'title', headerName: 'العنوان', flex: 1 },
    {
      field: 'status',
      headerName: 'الحالة',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusChipColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'تاريخ الإنشاء',
      width: 180,
      valueGetter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'إجراءات',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => navigate(`/transaction/${params.id}`)}>
          <Visibility />
        </IconButton>
      ),
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <SectionHeader
        title="قائمة المعاملات"
        subtitle="عرض وتتبع جميع المعاملات"
      />
      <DataTable
        loading={loading}
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Paper>
  );
};

export default TransactionsList;
