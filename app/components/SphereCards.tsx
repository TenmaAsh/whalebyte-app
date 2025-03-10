'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ethers } from 'ethers';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { useBlockchainTransaction } from '@/hooks/useBlockchainTransaction';
import { toast } from 'sonner';

interface Sphere {
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

interface SphereCardsProps {
  title: string;
  description: string;
  spheres: Sphere[];
  onRefresh?: () => void;
}

export function SphereCards({ title, description, spheres, onRefresh }: SphereCardsProps) {
  const { joinSphere } = useBlockchain();
  const { isLoading, execute } = useBlockchainTransaction();

  const handleJoinSphere = async (sphere: Sphere) => {
    try {
      await execute(
        async () => {
          await joinSphere(sphere.id);
          toast.success(`Successfully joined ${sphere.name}`);
          onRefresh?.();
        },
        {
          loadingMessage: `Joining ${sphere.name}...`,
          successMessage: `Welcome to ${sphere.name}!`,
          errorMessage: 'Failed to join sphere',
        }
      );
    } catch (error) {
      console.error('Error joining sphere:', error);
    }
  };

  if (spheres.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No spheres found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {spheres.map((sphere) => (
          <Card key={sphere.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {sphere.name}
                </CardTitle>
                <div className="flex gap-2">
                  {sphere.isPremium && (
                    <Badge variant="premium" className="bg-gradient-to-r from-amber-500 to-yellow-400">
                      Premium
                    </Badge>
                  )}
                  {sphere.isCreator && <Badge>Creator</Badge>}
                  {sphere.isMember && <Badge variant="secondary">Member</Badge>}
                </div>
              </div>
              <CardDescription className="line-clamp-2">{sphere.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>👥 {sphere.memberCount} members</span>
                {sphere.isPremium && (
                  <span className="font-medium">
                    Entry: {ethers.formatEther(sphere.entryFee)} ETH
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {!sphere.isCreator && !sphere.isMember && (
                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={() => handleJoinSphere(sphere)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Joining...' : `Join ${sphere.isPremium ? '• ' + ethers.formatEther(sphere.entryFee) + ' ETH' : 'Free'}`}
                </Button>
              )}
              {(sphere.isCreator || sphere.isMember) && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = `/spheres/${sphere.id}`}
                >
                  View Sphere
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}