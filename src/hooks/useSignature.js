import { useState, useCallback } from 'react';
import { signatureService } from '../services/signatureService';
import { useAlert } from '../context/AlertContext';

export function useSignature() {
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState(null);
  const { showAlert } = useAlert();

  const signDocument = useCallback(async (transactionId, signatureData) => {
    setLoading(true);
    try {
      const result = await signatureService.signTransaction(
        transactionId,
        signatureData
      );
      setSignature(result.signature);
      showAlert('تم توقيع المستند بنجاح', 'success');
      return result;
    } catch (error) {
      showAlert('فشل توقيع المستند. يرجى المحاولة مرة أخرى.', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const verifySignature = useCallback(async (transactionId, signatureHash) => {
    setLoading(true);
    try {
      const isVerified = await signatureService.verifySignature(
        transactionId,
        signatureHash
      );
      if (isVerified) {
        showAlert('تم التحقق من صحة التوقيع', 'success');
      } else {
        showAlert('لم يتم التحقق من صحة التوقيع', 'warning');
      }
      return isVerified;
    } catch (error) {
      showAlert('فشل التحقق من التوقيع', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const getSignatures = useCallback(async (transactionId) => {
    setLoading(true);
    try {
      const signatures = await signatureService.getTransactionSignatures(
        transactionId
      );
      return signatures;
    } catch (error) {
      showAlert('فشل جلب التوقيعات', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  return {
    loading,
    signature,
    signDocument,
    verifySignature,
    getSignatures,
  };
}