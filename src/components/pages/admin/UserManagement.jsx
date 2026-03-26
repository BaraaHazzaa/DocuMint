import { Paper, Typography } from '@mui/material';
import SectionHeader from '../../common/SectionHeader';

const UserManagement = () => {
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }} dir="rtl">
      <SectionHeader
        title="إدارة المستخدمين"
        subtitle="عرض وتعديل صلاحيات المستخدمين في النظام"
      />
      <Typography sx={{ mt: 3 }}>
        هذه الصفحة مخصصة لإدارة المستخدمين. سيتم هنا عرض قائمة بجميع المستخدمين مع إمكانية تعديل بياناتهم وصلاحياتهم أو حذفهم من النظام.
      </Typography>
      {/* A DataTable for users will be implemented here in the future */}
    </Paper>
  );
};

export default UserManagement;
