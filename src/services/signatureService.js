import { api } from './api';

const hashSignature = async (signatureData) => {
  // In a real implementation, this would use Web Crypto API
  // For demo purposes, we're using a simple hash
  const msgUint8 = new TextEncoder().encode(signatureData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const signatureService = {
  // Save signature for a transaction
  async signTransaction(transactionId, signatureData) {
    try {
      // Generate hash of the signature for verification
      const signatureHash = await hashSignature(signatureData);
      
      const response = await api.post(`/transactions/${transactionId}/sign`, {
        signature: signatureData,
        signatureHash,
        timestamp: new Date().toISOString()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  },

  // Verify a signature's authenticity
  async verifySignature(transactionId, signatureHash) {
    try {
      const response = await api.post(`/transactions/${transactionId}/verify`, {
        signatureHash
      });
      
      return response.data.verified;
    } catch (error) {
      console.error('Error verifying signature:', error);
      throw error;
    }
  },

  // Get all signatures for a transaction
  async getTransactionSignatures(transactionId) {
    try {
      const response = await api.get(`/transactions/${transactionId}/signatures`);
      return response.data;
    } catch (error) {
      console.error('Error fetching signatures:', error);
      throw error;
    }
  },

  // Convert signature data URL to Blob for storage
  async dataURLtoBlob(dataURL) {
    const response = await fetch(dataURL);
    return response.blob();
  }
};