'use client';

import React, { useState } from 'react';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { useSpheres } from '@/hooks/useSpheres';
import { SphereCards } from '@/components/SphereCards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreateSphereForm } from '@/components/blockchain/CreateSphereForm';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function SpheresPage() {
  const { isConnected } = useBlockchain();
  const { mySpheres, joinedSpheres, availableSpheres, isLoading, error, refresh } = useSpheres();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleSphereCreated = async (sphereId: number) => {
    setShowCreateDialog(false);
    await refresh();
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to create and join spheres.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.location.href = '/wallet'}
              className="w-full"
            >
              Go to Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive">Error loading spheres: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Spheres</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          Create New Sphere
        </Button>
      </div>

      <SphereCards
        title="My Spheres"
        description="Spheres you've created"
        spheres={mySpheres}
        onRefresh={refresh}
      />

      <SphereCards
        title="Joined Spheres"
        description="Spheres you're a member of"
        spheres={joinedSpheres}
        onRefresh={refresh}
      />

      <SphereCards
        title="Available Spheres"
        description="Spheres you can join"
        spheres={availableSpheres}
        onRefresh={refresh}
      />

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Sphere</DialogTitle>
            <DialogDescription>
              Fill in the details to create your sphere
            </DialogDescription>
          </DialogHeader>
          <CreateSphereForm
            onSuccess={handleSphereCreated}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}