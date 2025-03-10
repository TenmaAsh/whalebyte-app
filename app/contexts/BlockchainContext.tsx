'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { isSimulatorMode, getMockWallet, getMockTransaction, simulateDelay } from '@/lib/simulator';

interface BlockchainContextType {
  account: string | null;
  balance: bigint | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  createSphere: (params: {
    name: string;
    description: string;
    bannerImage?: string;
    categories: string[];
    rules: string[];
    isPremium: boolean;
    entryFee?: string;
  }) => Promise<number>;
  joinSphere: (sphereId: number) => Promise<void>;
  claimWelcomeBonus: () => Promise<ethers.TransactionResponse>;
}

const BlockchainContext = createContext<BlockchainContextType>({
  account: null,
  balance: null,
  isConnected: false,
  isLoading: false,
  connect: async () => {},
  disconnect: () => {},
  createSphere: async () => 0,
  joinSphere: async () => {},
  claimWelcomeBonus: async () => ({} as ethers.TransactionResponse),
});

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connect = async () => {
    setIsLoading(true);
    try {
      // Use simulator in simulator mode
      if (isSimulatorMode()) {
        await simulateDelay(1000);
        const { address, balance } = getMockWallet();
        setAccount(address);
        setBalance(balance);
        toast.success('Wallet connected successfully (Simulator Mode)');
        return;
      }

      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const address = accounts[0];
        const balance = await provider.getBalance(address);
        setAccount(address);
        setBalance(balance);
        toast.success('Wallet connected successfully');
      } else {
        throw new Error('Please install MetaMask');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalance(null);
    toast.info('Wallet disconnected');
  };

  const createSphere = async (params: {
    name: string;
    description: string;
    bannerImage?: string;
    categories: string[];
    rules: string[];
    isPremium: boolean;
    entryFee?: string;
  }): Promise<number> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    try {
      // Use simulator in simulator mode
      if (isSimulatorMode()) {
        await simulateDelay(2000);
        console.log('Creating sphere with params (Simulator Mode):', params);
        toast.success('Sphere created successfully (Simulator Mode)');
        return Math.floor(Math.random() * 1000) + 100;
      }

      // This is a placeholder. In a real implementation, you would call a contract method
      toast.success('Sphere created successfully');
      return Math.floor(Math.random() * 1000);
    } catch (error) {
      console.error('Error creating sphere:', error);
      toast.error('Failed to create sphere');
      throw error;
    }
  };

  const joinSphere = async (sphereId: number): Promise<void> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    try {
      // Use simulator in simulator mode
      if (isSimulatorMode()) {
        await simulateDelay(1500);
        console.log(`Joining sphere ${sphereId} (Simulator Mode)`);
        toast.success(`Joined sphere ${sphereId} successfully (Simulator Mode)`);
        return;
      }

      // This is a placeholder. In a real implementation, you would call a contract method
      toast.success(`Joined sphere ${sphereId} successfully`);
    } catch (error) {
      console.error('Error joining sphere:', error);
      toast.error('Failed to join sphere');
      throw error;
    }
  };

  const claimWelcomeBonus = async (): Promise<ethers.TransactionResponse> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    try {
      // Use simulator in simulator mode
      if (isSimulatorMode()) {
        await simulateDelay(2000);
        toast.success('Welcome bonus claimed successfully (Simulator Mode)');
        return getMockTransaction() as ethers.TransactionResponse;
      }

      // This is a placeholder. In a real implementation, you would call a contract method
      toast.success('Welcome bonus claimed successfully');
      return {} as ethers.TransactionResponse;
    } catch (error) {
      console.error('Error claiming welcome bonus:', error);
      toast.error('Failed to claim welcome bonus');
      throw error;
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const address = accounts[0].address;
            const balance = await provider.getBalance(address);
            setAccount(address);
            setBalance(balance);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setAccount(null);
          setBalance(null);
        } else if (accounts[0] !== account) {
          // User switched accounts
          setAccount(accounts[0]);
          // Update balance for new account
          const updateBalance = async () => {
            try {
              const provider = new ethers.BrowserProvider(window.ethereum);
              const balance = await provider.getBalance(accounts[0]);
              setBalance(balance);
            } catch (error) {
              console.error('Error updating balance:', error);
            }
          };
          updateBalance();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [account]);

  return (
    <BlockchainContext.Provider
      value={{
        account,
        balance,
        isConnected: !!account,
        isLoading,
        connect,
        disconnect,
        createSphere,
        joinSphere,
        claimWelcomeBonus,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, handler: (params: any) => void) => void;
      removeListener: (eventName: string, handler: (params: any) => void) => void;
      isMetaMask?: boolean;
    };
  }
}