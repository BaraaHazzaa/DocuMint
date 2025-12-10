import { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';

const SignatureContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const SignatureCanvas = styled(SignaturePad)({
  width: '100%',
  height: '200px',
  backgroundColor: '#fff',
});

export default function SignatureComponent({
  open,
  onClose,
  onSave,
  title = 'التوقيع الإلكتروني',
}) {
  const sigPadRef = useRef(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    sigPadRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (!sigPadRef.current?.isEmpty()) {
      // Get signature as PNG base64 string
      const signatureData = sigPadRef.current.toDataURL('image/png');
      onSave(signatureData);
      handleClear();
      onClose();
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      dir="rtl"
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            يرجى التوقيع في المساحة أدناه باستخدام الماوس أو شاشة اللمس
          </Typography>
        </Box>
        <SignatureContainer elevation={0}>
          <SignatureCanvas
            ref={sigPadRef}
            canvasProps={{
              className: 'signature-canvas',
            }}
            onBegin={handleBegin}
            backgroundColor="rgb(255,255,255)"
          />
        </SignatureContainer>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClear}
          color="secondary"
          disabled={isEmpty}
        >
          مسح
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={isEmpty}
        >
          حفظ التوقيع
        </Button>
      </DialogActions>
    </Dialog>
  );
}