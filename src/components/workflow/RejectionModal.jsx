import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

/**
 * A modal for entering a rejection reason.
 *
 * @param {object} props
 * @param {boolean} props.open - Whether the modal is open.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {function} props.onSubmit - Function to call with the rejection reason.
 */
const RejectionModal = ({ open, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('سبب الرفض مطلوب');
      return;
    }
    onSubmit(reason);
    setReason('');
    setError('');
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="rejection-modal-title"
    >
      <Paper sx={style} dir="rtl">
        <Typography id="rejection-modal-title" variant="h6" component="h2">
          سبب الرفض
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          margin="normal"
          label="يرجى توضيح سبب رفض المعاملة"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={handleClose}>
            إلغاء
          </Button>
          <Button variant="contained" color="error" onClick={handleSubmit}>
            تأكيد الرفض
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default RejectionModal;
