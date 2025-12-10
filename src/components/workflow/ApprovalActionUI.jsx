import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
} from '@mui/material';
import { WORKFLOW_ACTIONS } from '../../context/WorkflowContext';
import SignatureComponent from '../signature/SignatureComponent';

export default function ApprovalActionUI({
  onAction,
  disabled,
  loading = false,
  requiresSignature = true
}) {
  const [actionType, setActionType] = useState(null);
  const [comment, setComment] = useState('');
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [error, setError] = useState('');

  const handleActionClick = (action) => {
    setActionType(action);
    if (action === WORKFLOW_ACTIONS.APPROVE && requiresSignature) {
      setShowSignatureDialog(true);
    } else {
      handleAction(action);
    }
  };

  const handleAction = async (action, signatureData = null) => {
    try {
      setError('');
      
      // Validate signature requirement
      if (action === WORKFLOW_ACTIONS.APPROVE && requiresSignature && !signatureData) {
        setError('التوقيع مطلوب للموافقة');
        return;
      }
      
      // Validate comment requirement for rejection
      if (action === WORKFLOW_ACTIONS.REJECT && !comment.trim()) {
        setError('التعليق مطلوب عند الرفض');
        return;
      }

      await onAction({
        action,
        comment,
        signature: signatureData
      });
      
      // Clear form state
      setComment('');
      setShowSignatureDialog(false);
      setActionType(null);
    } catch (error) {
      setError(error.message || 'حدث خطأ أثناء معالجة الإجراء');
    }
  };

  const handleSignatureSave = (signatureData) => {
    handleAction(WORKFLOW_ACTIONS.APPROVE, signatureData);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="التعليق"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="أضف تعليقًا (اختياري)"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleActionClick(WORKFLOW_ACTIONS.APPROVE)}
          disabled={disabled || loading}
        >
          موافقة
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleActionClick(WORKFLOW_ACTIONS.REJECT)}
          disabled={disabled || loading}
        >
          رفض
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleActionClick(WORKFLOW_ACTIONS.ESCALATE)}
          disabled={disabled || loading}
        >
          تصعيد
        </Button>
      </Box>

      <Dialog
        open={showSignatureDialog}
        onClose={() => setShowSignatureDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>إضافة التوقيع</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            يرجى إضافة توقيعك للموافقة على المعاملة
          </Typography>
          <SignatureComponent
            onSave={handleSignatureSave}
            onClose={() => setShowSignatureDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}