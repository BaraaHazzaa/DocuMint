import { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Button,
  MenuItem,
  TextField,
  Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Add as AddIcon
} from '@mui/icons-material';

export default function ApprovalChainSelector({ value, onChange }) {
  const [availableApprovers] = useState([
    { id: '1', name: 'أحمد محمد', role: 'manager', department: 'المالية' },
    { id: '2', name: 'سارة أحمد', role: 'director', department: 'الموارد البشرية' },
    { id: '3', name: 'محمد علي', role: 'manager', department: 'العمليات' },
    { id: '4', name: 'فاطمة خالد', role: 'vice_manager', department: 'تكنولوجيا المعلومات' },
  ]);

  const handleAddApprover = () => {
    onChange([...value, { approverId: '', requiredAction: 'approve' }]);
  };

  const handleRemoveApprover = (index) => {
    const newChain = value.filter((_, i) => i !== index);
    onChange(newChain);
  };

  const handleMoveApprover = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === value.length - 1)
    ) {
      return;
    }

    const newChain = [...value];
    const swap = direction === 'up' ? index - 1 : index + 1;
    [newChain[index], newChain[swap]] = [newChain[swap], newChain[index]];
    onChange(newChain);
  };

  const handleApproverChange = (index, field, newValue) => {
    const newChain = value.map((approver, i) =>
      i === index ? { ...approver, [field]: newValue } : approver
    );
    onChange(newChain);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">سلسلة الموافقات</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddApprover}
          variant="outlined"
          size="small"
        >
          إضافة موافق
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: 2 }}>
        {value.length === 0 ? (
          <Typography color="textSecondary" align="center">
            لم يتم إضافة موافقين بعد
          </Typography>
        ) : (
          <List>
            {value.map((approver, index) => (
              <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  gap: 2,
                  py: 2,
                  borderBottom: index < value.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                <Typography sx={{ minWidth: 30 }}>#{index + 1}</Typography>
                
                <TextField
                  select
                  size="small"
                  value={approver.approverId}
                  onChange={(e) => handleApproverChange(index, 'approverId', e.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  {availableApprovers.map((a) => (
                    <MenuItem key={a.id} value={a.id}>
                      {a.name} - {a.department}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  value={approver.requiredAction}
                  onChange={(e) => handleApproverChange(index, 'requiredAction', e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="approve">موافقة</MenuItem>
                  <MenuItem value="review">مراجعة</MenuItem>
                </TextField>

                <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveApprover(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUpIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveApprover(index, 'down')}
                    disabled={index === value.length - 1}
                  >
                    <ArrowDownIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveApprover(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}