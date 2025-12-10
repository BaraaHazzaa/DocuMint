// Temporary file for the new implementation
import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Alert,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../services/api';

export default function NewTransaction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    importance: 'medium',
    recipient: '',
    file: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState({ url: null, type: null, name: '' });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, file }));
        // Handle file preview
        if (file.type.startsWith('image/')) {
          setFilePreview({
            url: URL.createObjectURL(file),
            type: 'image',
            name: file.name
          });
        } else {
          setFilePreview({
            url: null,
            type: file.type,
            name: file.name
          });
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      setError('يرجى تحميل ملف');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await transactionService.createTransaction(formData);
      navigate('/dashboard', { 
        state: { message: 'تم إنشاء المعاملة بنجاح' }
      });
    } catch (err) {
      setError('فشل إنشاء المعاملة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }} dir="rtl">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          إنشاء معاملة جديدة
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="عنوان المعاملة"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="الوصف"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="مستوى الأهمية"
                name="importance"
                value={formData.importance}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="low">منخفضة</MenuItem>
                <MenuItem value="medium">متوسطة</MenuItem>
                <MenuItem value="high">مرتفعة</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="المستلم"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="manager">المدير</MenuItem>
                <MenuItem value="vice_manager">نائب المدير</MenuItem>
                <MenuItem value="director">المدير العام</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ 
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 1,
                p: 3,
                textAlign: 'center'
              }}>
                <input
                  type="file"
                  id="file-upload"
                  name="file"
                  hidden
                  onChange={handleChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    sx={{ mb: 2 }}
                  >
                    اختيار ملف
                  </Button>
                </label>
                <Typography variant="body2" color="text.secondary">
                  يمكنك تحميل صور أو مستندات PDF أو Word
                </Typography>
              </Box>
            </Grid>

            {filePreview.name && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    الملف المحدد:
                  </Typography>
                  {filePreview.type === 'image' ? (
                    <Box sx={{ 
                      maxWidth: '100%',
                      maxHeight: '300px',
                      overflow: 'hidden',
                      borderRadius: 1,
                      mb: 1
                    }}>
                      <img
                        src={filePreview.url}
                        alt="معاينة"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>
                        {filePreview.name}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading || !formData.file}
                sx={{ mt: 2 }}
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء المعاملة'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}