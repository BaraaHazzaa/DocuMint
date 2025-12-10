import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const SignatureDisplay = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const SignatureImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  display: 'block',
});

export default function SignatureViewer({ 
  signature,
  signedBy,
  signedAt,
  verified = false 
}) {
  return (
    <SignatureDisplay elevation={0}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        تم التوقيع بواسطة: {signedBy}
      </Typography>
      
      <Box sx={{ my: 2 }}>
        <SignatureImage src={signature} alt="توقيع إلكتروني" />
      </Box>
      
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="caption" color="textSecondary">
          {new Date(signedAt).toLocaleString('ar-SY')}
        </Typography>
        
        {verified ? (
          <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            ✓ موثق
          </Typography>
        ) : (
          <Typography variant="caption" color="warning.main">
            قيد التحقق
          </Typography>
        )}
      </Box>
    </SignatureDisplay>
  );
}