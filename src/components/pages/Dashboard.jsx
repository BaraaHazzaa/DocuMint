import { useAuth } from '../../context/AuthContext';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';
import AdminDashboard from './AdminDashboard';
import { Box, Typography } from '@mui/material';

export default function Dashboard() {
  const { user } = useAuth();

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'employee':
        return <EmployeeDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <Box textAlign="center" mt={5}>
            <Typography variant="h6">
              No specific dashboard available for your role.
            </Typography>
          </Box>
        );
    }
  };

  return <>{renderDashboardByRole()}</>;
}