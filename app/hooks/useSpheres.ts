import { useState, useEffect } from 'react';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { isSimulatorMode, getMockSpheres, simulateDelay } from '@/lib/simulator';

export interface Sphere {
  id: number;
  name: string;
  description: string;
  creatorAddress: string;
  memberCount: number;
  isPremium: boolean;
  entryFee: string;
  isCreator?: boolean;
  isMember?: boolean;
  isModerator?: boolean;
}

export interface UseSpheres {
  mySpheres: Sphere[];
  joinedSpheres: Sphere[];
  availableSpheres: Sphere[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useSpheres(): UseSpheres {
  const { account } = useBlockchain();
  const [mySpheres, setMySpheres] = useState<Sphere[]>([]);
  const [joinedSpheres, setJoinedSpheres] = useState<Sphere[]>([]);
  const [availableSpheres, setAvailableSpheres] = useState<Sphere[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSpheres = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use simulator in simulator mode
      if (isSimulatorMode()) {
        await simulateDelay(1000);
        const mockData = getMockSpheres();
        setMySpheres(mockData.mySpheres);
        setJoinedSpheres(mockData.joinedSpheres);
        setAvailableSpheres(mockData.availableSpheres);
        return;
      }

      // If no account, set empty arrays
      if (!account) {
        setMySpheres([]);
        setJoinedSpheres([]);
        setAvailableSpheres([]);
        return;
      }

      // This is mock data for demonstration
      // In a real app, you would fetch data from your API or blockchain
      const mockData = [
        {
          id: 1,
          name: 'Crypto Enthusiasts',
          description: 'A sphere for crypto enthusiasts',
          creatorAddress: account,
          memberCount: 25,
          isPremium: false,
          entryFee: '0',
        },
        {
          id: 2,
          name: 'NFT Collectors',
          description: 'A sphere for NFT collectors',
          creatorAddress: '0x1234567890123456789012345678901234567890',
          memberCount: 15,
          isPremium: true,
          entryFee: '0.01',
        },
        {
          id: 3,
          name: 'DeFi Explorers',
          description: 'A sphere for DeFi enthusiasts',
          creatorAddress: '0x0987654321098765432109876543210987654321',
          memberCount: 10,
          isPremium: false,
          entryFee: '0',
        },
      ];

      // Filter spheres based on user's relationship to them
      setMySpheres(
        mockData.filter((sphere) => sphere.creatorAddress === account)
          .map(sphere => ({ ...sphere, isCreator: true }))
      );
      
      setJoinedSpheres(
        mockData.filter((sphere) => sphere.creatorAddress !== account)
          .slice(0, 1)
          .map(sphere => ({ ...sphere, isMember: true }))
      );
      
      setAvailableSpheres(
        mockData.filter((sphere) => sphere.creatorAddress !== account)
          .slice(1)
      );
    } catch (err) {
      console.error('Error fetching spheres:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch spheres'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpheres();
  }, [account]);

  const refresh = async () => {
    await fetchSpheres();
  };

  return {
    mySpheres,
    joinedSpheres,
    availableSpheres,
    isLoading,
    error,
    refresh,
  };
}