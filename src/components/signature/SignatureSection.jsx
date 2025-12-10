import { useState } from 'react';
import { Box, Button } from '@mui/material';
import SignatureComponent from './SignatureComponent';
import SignatureViewer from './SignatureViewer';
import { useSignature } from '../../hooks/useSignature';
import { useAuth } from '../../context/AuthContext';

export default function SignatureSection({ transactionId, onSignatureComplete }) {
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const { user: _user } = useAuth();
  const { loading, signDocument, verifySignature: _verifySignature } = useSignature();

  const handleSignatureComplete = async (signatureData) => {
    try {
      await signDocument(transactionId, signatureData);
      onSignatureComplete?.();
    } catch (error) {
      console.error('Error saving signature:', error);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsSignatureModalOpen(true)}
        disabled={loading}
      >
        إضافة توقيع
      </Button>

      <SignatureComponent
        open={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureComplete}
      />
    </Box>
  );
}