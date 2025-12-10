import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  TextField,
  List,
  ListItem,
  ListItemText,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { transactionService } from '../../services/api';
import { useWorkflow } from '../../context/WorkflowContext';
import { useAuth } from '../../context/AuthContext';
import { useNotificationManager } from '../../hooks/useNotificationManager';
import SignatureComponent from '../signature/SignatureComponent';
import WorkflowStatus from '../workflow/WorkflowStatus';
import ApprovalActionUI from '../workflow/ApprovalActionUI';
import { WORKFLOW_ACTIONS, WORKFLOW_STEPS } from '../../context/WorkflowContext';

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { processAction, getWorkflowStatus, canTakeAction } = useWorkflow();
  const { notifications } = useNotificationManager();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [signature, setSignature] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        const [transactionData, workflowData, historyData] = await Promise.all([
          transactionService.getTransaction(id),
          getWorkflowStatus(id),
          transactionService.getTransactionHistory(id)
        ]);

        setTransaction(transactionData);
        setWorkflowStatus(workflowData);
        setComments(historyData.comments);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [id, getWorkflowStatus]);

  const handleActionClick = (action) => {
    setActionType(action);
    if (action === WORKFLOW_ACTIONS.APPROVE) {
      setShowSignatureDialog(true);
    } else {
      handleAction(action);
    }
  };

  const handleAction = async (action, signatureData = null) => {
    try {
      setActionError('');
      setLoading(true);

      const result = await processAction({
        transactionId: id,
        action,
        userId: user.id,
        comment: newComment,
        signature: signatureData
      });

      if (result.success) {
        setWorkflowStatus(result.workflow);
        setNewComment('');
        setSignature(null);
        setShowSignatureDialog(false);
      } else {
        setActionError('فشل تنفيذ الإجراء. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setActionError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureSave = (signatureData) => {
    setSignature(signatureData);
    handleAction(WORKFLOW_ACTIONS.APPROVE, signatureData);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [...prev, { text: newComment, timestamp: new Date() }]);
      setNewComment('');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!transaction) {
    return <Typography variant="h6">لم يتم العثور على المعاملة</Typography>;
  }

  return (
    <Container maxWidth="md" dir="rtl">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          تفاصيل المعاملة
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6">{transaction.title}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {transaction.description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            الحالة: {transaction.status}
          </Typography>
        </Paper>

        <Typography variant="h6" gutterBottom>
          المستند
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          {transaction.fileUrl && (
            <Box>
              {transaction.fileType?.startsWith('image/') ? (
                <Box sx={{ 
                  maxWidth: '100%',
                  maxHeight: '600px',
                  overflow: 'hidden',
                  borderRadius: 1,
                  mb: 2
                }}>
                  <img
                    src={transaction.fileUrl}
                    alt="مستند المعاملة"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" gutterBottom>
                    {transaction.fileName || 'المستند'}
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    href={transaction.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1 }}
                  >
                    عرض المستند
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Paper>

        <Typography variant="h6" gutterBottom>
          التعليقات
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <List>
            {comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={comment.text}
                  secondary={new Date(comment.timestamp).toLocaleString('ar-SY')}
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <TextField
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="أضف تعليقًا"
            />
            <Button onClick={handleAddComment} variant="contained" color="primary" sx={{ ml: 2 }}>
              إضافة
            </Button>
          </Box>
        </Paper>

        <Typography variant="h6" gutterBottom>
          سجل التدقيق
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <List>
            {transaction.history.map((entry, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={entry.action}
                  secondary={new Date(entry.timestamp).toLocaleString('ar-SY')}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

          {workflowStatus && (
            <WorkflowStatus workflow={workflowStatus} />
          )}        {actionError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {actionError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {canTakeAction(user.id, id) && (
            <ApprovalActionUI
              onAction={handleAction}
              disabled={loading}
              loading={loading}
              requiresSignature={true}
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              العودة إلى لوحة التحكم
            </Button>
          </Box>
        </Box>

        <Dialog
          open={showSignatureDialog}
          onClose={() => setShowSignatureDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>إضافة التوقيع</DialogTitle>
          <DialogContent>
            <SignatureComponent
              onSave={handleSignatureSave}
              onClose={() => setShowSignatureDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
}