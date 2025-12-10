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
  Grid,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../services/api';
import ApprovalChainSelector from '../workflow/ApprovalChainSelector';

export default function NewTransaction() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    importance: 'medium',
    file: null,
    approvalChain: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState({ url: null, type: null, name: '' });

  const steps = [
    { label: 'معلومات المعاملة', description: 'أدخل تفاصيل المعاملة الأساسية' },
    { label: 'المستندات', description: 'قم بتحميل المستندات المطلوبة' },
    { label: 'سلسلة الموافقات', description: 'حدد مسار الموافقات المطلوب' },
    { label: 'المراجعة', description: 'راجع المعلومات قبل الإرسال' }
  ];

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.title || !formData.description || !formData.importance) {
          setError('يرجى إكمال جميع الحقول المطلوبة');
          return false;
        }
        break;
      case 1:
        if (!formData.file) {
          setError('يرجى تحميل ملف');
          return false;
        }
        break;
      case 2:
        if (!formData.approvalChain.length) {
          setError('يرجى تحديد سلسلة الموافقات');
          return false;
        }
        break;
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, file }));
        // Create preview for images, show file info for PDFs and other files
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
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateCurrentStep()) {
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Add workflow metadata
      const transactionData = {
        ...formData,
        status: 'pending',
        workflowStatus: 'initiated',
        currentApprover: formData.approvalChain[0]?.approverId,
      };

      await transactionService.createTransaction(transactionData);
      navigate('/dashboard', { 
        state: { message: 'تم إنشاء المعاملة بنجاح' }
      });
    } catch (err) {
      setError('فشل إنشاء المعاملة. يرجى المحاولة مرة أخرى.');
      setActiveStep(0); // Return to first step on error
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
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
                required
              />
            </Grid>
            <Grid item xs={12}>
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
                <MenuItem value="urgent">عاجلة</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
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
          </Grid>
        );

      case 2:
        return (
          <ApprovalChainSelector
            value={formData.approvalChain}
            onChange={(newChain) => setFormData(prev => ({ ...prev, approvalChain: newChain }))}
          />
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>ملخص المعاملة</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">العنوان: {formData.title}</Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                    {formData.description}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    مستوى الأهمية: {formData.importance}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    عدد الموافقين: {formData.approvalChain.length}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    المستند المرفق: {filePreview.name}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }} dir="rtl">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          إنشاء معاملة جديدة
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="body2">{step.label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 4 }}>
          {renderStepContent()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            السابق
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء المعاملة'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              التالي
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}