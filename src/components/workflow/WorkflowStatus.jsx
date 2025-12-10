import { Box, Typography, Paper } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { WORKFLOW_STEPS } from '../../context/WorkflowContext';

const _stepStatus = {
  initiated: { color: 'info', label: 'تم البدء' },
  in_progress: { color: 'warning', label: 'قيد المراجعة' },
  completed: { color: 'success', label: 'مكتمل' },
  rejected: { color: 'error', label: 'مرفوض' },
  escalated: { color: 'warning', label: 'تم التصعيد' }
};

export default function WorkflowStatus({ workflow }) {
  if (!workflow) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        حالة سير العمل
      </Typography>
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
        <Timeline position="right">
          {workflow.approvalChain.map((step, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot 
                  color={
                    step.status === 'approved' ? 'success' :
                    step.status === 'rejected' ? 'error' :
                    index === workflow.currentApproverIndex ? 'warning' : 'grey'
                  }
                />
                {index < workflow.approvalChain.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle1" component="span">
                    {step.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.role}
                  </Typography>
                  {step.actionDate && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      {new Date(step.actionDate).toLocaleString('ar-SY')}
                    </Typography>
                  )}
                  {step.status !== 'pending' && (
                    <Typography 
                      variant="body2" 
                      color={step.status === 'approved' ? 'success.main' : 'error.main'}
                    >
                      {step.status === 'approved' ? 'تمت الموافقة' : 'تم الرفض'}
                    </Typography>
                  )}
                  {step.comment && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      التعليق: {step.comment}
                    </Typography>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>
    </Box>
  );
}