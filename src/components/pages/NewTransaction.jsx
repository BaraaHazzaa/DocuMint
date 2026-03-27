import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Typography,
  MenuItem,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Check,
  Description,
  AccountTree,
  FileUpload,
  RateReview,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { transactionService } from '../../services/api';
import ApprovalChainSelector from '../workflow/ApprovalChainSelector';
import SectionHeader from '../common/SectionHeader';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
  '& .QontoStepIcon-completedIcon': {
    color: theme.palette.primary.main,
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className, icon } = props;
  const icons = {
    1: <Description />,
    2: <FileUpload />,
    3: <AccountTree />,
    4: <RateReview />,
  };

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        icons[String(icon)]
      )}
    </QontoStepIconRoot>
  );
}

export default function NewTransaction() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    importance: 'medium',
    file: null,
    approvalChain: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState({ url: null, type: null, name: '' });
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (isEditing) {
      const fetchTransaction = async () => {
        try {
          setLoading(true);
          const transaction = await transactionService.getTransaction(id);
          setFormData({
            title: transaction.title,
            description: transaction.description,
            importance: transaction.importance,
            file: transaction.file,
            approvalChain: transaction.approvalChain,
          });
        } catch {
          setError(t('newTransaction.errors.loadFailed'));
        } finally {
          setLoading(false);
        }
      };
      fetchTransaction();
    }
  }, [id, isEditing, t]);

  const onUploadProgress = (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setUploadProgress(percentCompleted);
  };

  const steps = [
    t('newTransaction.steps.details'),
    t('newTransaction.steps.documents'),
    t('newTransaction.steps.workflow'),
    t('newTransaction.steps.review'),
  ];

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      setUploadProgress(0);
      const transactionData = { ...formData, status: 'draft' };
      await transactionService.saveDraft(transactionData, onUploadProgress);
      toast.success(t('newTransaction.notifications.draftSuccess'));
      navigate('/dashboard');
    } catch {
      toast.error(t('newTransaction.notifications.draftError'));
      setError(t('newTransaction.notifications.draftError'));
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.title || !formData.description || !formData.importance) {
          setError(t('newTransaction.errors.requiredFields'));
          return false;
        }
        break;
      case 1:
        if (!formData.file) {
          setError(t('newTransaction.errors.fileRequired'));
          return false;
        }
        break;
      case 2:
        if (!formData.approvalChain.length) {
          setError(t('newTransaction.errors.workflowRequired'));
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
      setUploadProgress(0);
      if (file) {
        setFormData((prev) => ({ ...prev, file }));
        if (file.type.startsWith('image/')) {
          setFilePreview({
            url: URL.createObjectURL(file),
            type: 'image',
            name: file.name,
          });
        } else {
          setFilePreview({
            url: null,
            type: file.type,
            name: file.name,
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
      setUploadProgress(0);

      const transactionData = {
        ...formData,
        status: 'pending',
        workflowStatus: 'initiated',
        currentApprover: formData.approvalChain[0]?.approverId,
      };

      if (isEditing) {
        // await transactionService.updateTransaction(id, transactionData, onUploadProgress);
      } else {
        await transactionService.createTransaction(transactionData, onUploadProgress);
      }
      
      toast.success(isEditing ? t('newTransaction.notifications.updateSuccess') : t('newTransaction.notifications.createSuccess'));
      navigate('/dashboard');
    } catch {
      toast.error(t('newTransaction.notifications.submitError'));
      setError(t('newTransaction.notifications.submitError'));
      setActiveStep(0);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label={t('newTransaction.fields.title')}
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('newTransaction.fields.description')}
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
                label={t('newTransaction.fields.importance')}
                name="importance"
                value={formData.importance}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="low">{t('newTransaction.importance.low')}</MenuItem>
                <MenuItem value="medium">{t('newTransaction.importance.medium')}</MenuItem>
                <MenuItem value="high">{t('newTransaction.importance.high')}</MenuItem>
                <MenuItem value="urgent">{t('newTransaction.importance.urgent')}</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'action.hover',
                  transition: 'background-color 0.3s',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
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
                    startIcon={<FileUpload />}
                    sx={{ mb: 2 }}
                  >
                    {t('newTransaction.buttons.selectFile')}
                  </Button>
                </label>
                <Typography variant="body2" color="text.secondary">
                  {t('newTransaction.fileHelpText')}
                </Typography>
              </Box>
            </Grid>

            {filePreview.name && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('newTransaction.selectedFile')}:
                  </Typography>
                  {filePreview.type.startsWith('image/') ? (
                    <Box
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        overflow: 'hidden',
                        borderRadius: 1,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <img
                        src={filePreview.url}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description />
                      <Typography>{filePreview.name}</Typography>
                    </Box>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                      <LinearProgress variant="determinate" value={uploadProgress} />
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
            onChange={(newChain) => setFormData((prev) => ({ ...prev, approvalChain: newChain }))}
          />
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>{t('newTransaction.review.title')}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1"><strong>{t('newTransaction.fields.title')}:</strong> {formData.title}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    {formData.description}
                  </Typography>
                  <Chip label={`${t('newTransaction.fields.importance')}: ${t(`newTransaction.importance.${formData.importance}`)}`} sx={{ mt: 1 }} />
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    <strong>{t('newTransaction.review.approvers')}:</strong> {formData.approvalChain.length}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    <strong>{t('newTransaction.review.attachment')}:</strong> {filePreview.name}
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <SectionHeader
          title={isEditing ? t('newTransaction.editTitle') : t('newTransaction.createTitle')}
          subtitle={t('newTransaction.subtitle')}
        />

        <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />} sx={{ mb: 5 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={(props) => <QontoStepIcon {...props} icon={index + 1} />}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 4, minHeight: 300 }}>
          {renderStepContent()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
          >
            {t('newTransaction.buttons.back')}
          </Button>

          <Box>
            <Button
              variant="text"
              color="secondary"
              onClick={handleSaveDraft}
              disabled={loading}
              sx={{ mx: 1 }}
            >
              {t('newTransaction.buttons.saveDraft')}
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? t('newTransaction.buttons.saving') : isEditing ? t('newTransaction.buttons.update') : t('newTransaction.buttons.create')}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {t('newTransaction.buttons.next')}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}