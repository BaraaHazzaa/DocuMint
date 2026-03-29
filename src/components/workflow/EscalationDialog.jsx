import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { transactionService } from '../../services/api'; // Assuming a service to get users

export default function EscalationDialog({ open, onClose, onEscalate }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          // This is a placeholder. You'll need a real service to fetch users.
          const allUsers = await transactionService.getUsers(); // You need to create this service function
          setUsers(allUsers);
        } catch (error) {
          console.error("Failed to fetch users:", error);
          // Handle error, maybe show a message
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [open]);

  const handleEscalate = () => {
    if (selectedUserId) {
      onEscalate(selectedUserId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>تصعيد المعاملة</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <TextField
            select
            fullWidth
            label="اختر المستخدم للتصعيد إليه"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            variant="outlined"
            margin="normal"
            disabled={loading}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} ({user.role})
              </MenuItem>
            ))}
          </TextField>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          إلغاء
        </Button>
        <Button
          onClick={handleEscalate}
          color="primary"
          variant="contained"
          disabled={!selectedUserId || loading}
        >
          تصعيد
        </Button>
      </DialogActions>
    </Dialog>
  );
}
