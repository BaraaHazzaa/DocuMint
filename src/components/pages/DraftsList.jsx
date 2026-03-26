import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../services/api';
import SectionHeader from '../common/SectionHeader';

const DraftsList = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const data = await transactionService.getDrafts();
        setDrafts(data);
      } catch {
        setError('فشل تحميل المسودات');
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handleEdit = (id) => {
    navigate(`/transaction/edit/${id}`);
  };

  const handleDelete = async (id) => {
    // Optional: Add a confirmation dialog here
    try {
      // await transactionService.deleteDraft(id); // This service function needs to be created
      setDrafts(drafts.filter((draft) => draft.id !== id));
    } catch {
      setError('فشل حذف المسودة');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <SectionHeader title="المسودات" subtitle="المعاملات التي لم يتم إرسالها بعد" />
      {drafts.length === 0 ? (
        <Typography>لا يوجد مسودات حالياً.</Typography>
      ) : (
        <List>
          {drafts.map((draft) => (
            <ListItem
              key={draft.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(draft.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(draft.id)} sx={{ mr: 1 }}>
                    <Delete />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={draft.title}
                secondary={`آخر تحديث: ${new Date(draft.updatedAt).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default DraftsList;
