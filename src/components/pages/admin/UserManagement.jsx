import { useState, useEffect, useCallback } from 'react';
import { Paper, Box, Chip, IconButton, Avatar } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { userService } from '../../../services/api';
import DataTable from '../../common/DataTable';
import SectionHeader from '../../common/SectionHeader';
import debounce from 'lodash.debounce';

const getRoleChipColor = (role) => {
  switch (role) {
    case 'admin':
      return 'error';
    case 'manager':
      return 'warning';
    case 'employee':
      return 'success';
    default:
      return 'default';
  }
};

const UserManagement = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 500),
    []
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = { ...paginationModel, search: searchQuery };
        const response = await userService.getUsers(params);
        setRows(response.data || []);
        setRowCount(response.total || 0);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setRows([]);
        setRowCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [paginationModel, searchQuery]);

  const columns = [
    {
      field: 'name',
      headerName: t('userManagement.columns.name'),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: 'primary.light' }}>
            {params.row.name.charAt(0)}
          </Avatar>
          {params.row.name}
        </Box>
      ),
    },
    { field: 'email', headerName: t('userManagement.columns.email'), flex: 1 },
    {
      field: 'role',
      headerName: t('userManagement.columns.role'),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getRoleChipColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: t('userManagement.columns.actions'),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => console.log('Edit user', params.id)}>
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => console.log('Delete user', params.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mt: 4 }} dir="rtl">
      <SectionHeader
        title={t('userManagement.title')}
        subtitle={t('userManagement.subtitle')}
      />
      <DataTable
        loading={loading}
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onSearch={debouncedSearch}
      />
    </Paper>
  );
};

export default UserManagement;
