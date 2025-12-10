import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { WORKFLOW_STEPS } from '../context/WorkflowContext';

const ColorlibStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    marginTop: 8,
    fontWeight: 500,
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
  },
}));

const StepperContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const getSteps = (importance) => {
  const baseSteps = [
    {
      label: 'تم الإنشاء',
      description: 'تم إنشاء المعاملة وإرسالها للمراجعة',
    },
    {
      label: 'مراجعة المدير',
      description: 'قيد المراجعة من قبل المدير',
    }
  ];

  if (importance === 'high' || importance === 'medium') {
    baseSteps.push({
      label: 'مراجعة نائب المدير',
      description: 'قيد المراجعة من قبل نائب المدير',
    });
  }

  if (importance === 'high' || importance === 'urgent') {
    baseSteps.push({
      label: 'مراجعة المدير العام',
      description: 'قيد المراجعة من قبل المدير العام',
    });
  }

  baseSteps.push({
    label: 'مكتمل',
    description: 'تم اكتمال المعاملة',
  });

  return baseSteps;
};

const getStepStatus = (step, currentStep) => {
  const stepOrder = Object.values(WORKFLOW_STEPS);
  const currentIndex = stepOrder.indexOf(currentStep);
  const stepIndex = stepOrder.indexOf(step);

  if (currentStep === WORKFLOW_STEPS.REJECTED) {
    return 'rejected';
  }

  if (stepIndex < currentIndex) {
    return 'completed';
  }
  if (stepIndex === currentIndex) {
    return 'active';
  }
  return 'pending';
};

export default function WorkflowStepper({ currentStep, importance, deadline }) {
  const steps = getSteps(importance);

  return (
    <StepperContainer>
      <Stepper activeStep={getStepStatus(currentStep)} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <ColorlibStepLabel>
              <Typography variant="body2" align="center">
                {step.label}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                align="center"
                sx={{ display: 'block' }}
              >
                {step.description}
              </Typography>
              {index === getStepStatus(currentStep, 'active') && deadline && (
                <Typography
                  variant="caption"
                  color="error"
                  align="center"
                  sx={{ display: 'block', mt: 1 }}
                >
                  الموعد النهائي: {new Date(deadline).toLocaleString('ar-SY')}
                </Typography>
              )}
            </ColorlibStepLabel>
          </Step>
        ))}
      </Stepper>
    </StepperContainer>
  );
}