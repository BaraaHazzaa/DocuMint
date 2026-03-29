import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { transactionService } from '../../../services/api'; // Placeholder for a real admin service
import SectionHeader from '../../common/SectionHeader';

// Mocked data - in a real app, this would come from the backend
const MOCK_ROLES = ['admin', 'manager', 'employee'];
const MOCK_PERMISSIONS = [
  'create_transaction',
  'approve_transaction',
  'reject_transaction',
  'escalate_transaction',
  'view_all_transactions',
  'manage_users',
  'view_reports',
  'manage_system_settings',
];

export default function PermissionsManagement() {
  const [roles, setRoles] = useState(MOCK_ROLES);
  const [permissions, setPermissions] = useState(MOCK_PERMISSIONS);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      setError('');
      try {
        // In a real app, you would fetch this from your API
        // const data = await adminService.getRolePermissions();
        // For now, we'll use mock data
        const mockData = {
          admin: ['create_transaction', 'approve_transaction', 'reject_transaction', 'escalate_transaction', 'view_all_transactions', 'manage_users', 'view_reports', 'manage_system_settings'],
          manager: ['create_transaction', 'approve_transaction', 'reject_transaction', 'escalate_transaction'],
          employee: ['create_transaction'],
        };
        setRolePermissions(mockData);
      } catch (err) {
        setError('Failed to load permissions data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const handlePermissionChange = (role, permission) => {
    setRolePermissions((prev) => {
      const currentPermissions = prev[role] || [];
      const newPermissions = currentPermissions.includes(permission)
        ? currentPermissions.filter((p) => p !== permission)
        : [...currentPermissions, permission];
      return { ...prev, [role]: newPermissions };
    });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // In a real app, you would send this to your API
      // await adminService.updateRolePermissions(rolePermissions);
      console.log('Saving permissions:', rolePermissions);
      setSuccess('Permissions updated successfully!');
    } catch (err) {
      setError('Failed to save permissions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SectionHeader
        title="إدارة الأذونات"
        subtitle="تحديد الصلاحيات لكل دور وظيفي في النظام"
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Paper elevation={3} sx={{ p: 4 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>الصلاحية</TableCell>
                {roles.map((role) => (
                  <TableCell key={role} align="center" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {role}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission} hover>
                  <TableCell component="th" scope="row">
                    {permission.replace(/_/g, ' ')}
                  </TableCell>
                  {roles.map((role) => (
                    <TableCell key={role} align="center">
                      <Checkbox
                        checked={rolePermissions[role]?.includes(permission) || false}
                        onChange={() => handlePermissionChange(role, permission)}
                        disabled={role === 'admin'} // Admins should have all permissions
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
