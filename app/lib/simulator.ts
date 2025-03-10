import { ethers } from 'ethers';

export const isSimulatorMode = () => {
  return typeof window !== 'undefined' && 
    window.location.search.includes('simulator=true') || 
    process.env.NEXT_PUBLIC_SIMULATOR_MODE === 'true';
};

export const getMockWallet = () => {
  return {
    address: '0x1234567890123456789012345678901234567890',
    balance: ethers.parseEther('10.0'),
  };
};

export const getMockSpheres = () => {
  return {
    mySpheres: [
      {
        id: 1,
        name: 'My First Sphere',
        description: 'This is a sphere I created for testing',
        creatorAddress: '0x1234567890123456789012345678901234567890',
        memberCount: 5,
        isPremium: false,
        entryFee: '0',
        isCreator: true,
      },
      {
        id: 2,
        name: 'Premium Sphere',
        description: 'This is a premium sphere with entry fee',
        creatorAddress: '0x1234567890123456789012345678901234567890',
        memberCount: 3,
        isPremium: true,
        entryFee: ethers.parseEther('0.01').toString(),
        isCreator: true,
      },
    ],
    joinedSpheres: [
      {
        id: 3,
        name: 'Joined Sphere',
        description: 'This is a sphere I joined',
        creatorAddress: '0x0987654321098765432109876543210987654321',
        memberCount: 10,
        isPremium: false,
        entryFee: '0',
        isMember: true,
      },
    ],
    availableSpheres: [
      {
        id: 4,
        name: 'Available Sphere',
        description: 'This is an available sphere to join',
        creatorAddress: '0x5555555555555555555555555555555555555555',
        memberCount: 8,
        isPremium: false,
        entryFee: '0',
      },
      {
        id: 5,
        name: 'Premium Available',
        description: 'This is a premium sphere available to join',
        creatorAddress: '0x6666666666666666666666666666666666666666',
        memberCount: 4,
        isPremium: true,
        entryFee: ethers.parseEther('0.05').toString(),
      },
    ],
  };
};

export const getMockTransaction = () => {
  return {
    hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    wait: async () => ({ status: 1 }),
  };
};

export const simulateDelay = async (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};