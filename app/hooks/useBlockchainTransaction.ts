import { useState } from 'react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

interface TransactionOptions {
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function useBlockchainTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const execute = async (
    transactionFn: () => Promise<any>,
    options: TransactionOptions = {}
  ) => {
    const {
      loadingMessage = 'Processing transaction...',
      successMessage = 'Transaction successful!',
      errorMessage = 'Transaction failed',
    } = options;

    setIsLoading(true);
    setIsTransacting(true);

    try {
      if (loadingMessage) {
        toast.loading(loadingMessage);
      }

      const result = await transactionFn();

      if (successMessage) {
        toast.success(successMessage);
      }

      return result;
    } catch (error) {
      console.error('Transaction error:', error);
      
      if (error instanceof Error) {
        toast.error(errorMessage + ': ' + error.message);
      } else {
        toast.error(errorMessage);
      }

      throw error;
    } finally {
      setIsLoading(false);
      setIsTransacting(false);
    }
  };

  return {
    isLoading,
    isTransacting,
    retryCount,
    execute,
  };
}