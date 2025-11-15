'use client';

import { useState } from 'react';
import type { Campaign } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

type DonationFormProps = {
  campaign: Campaign;
};

export function DonationForm({ campaign }: DonationFormProps) {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const progress = (campaign.currentAmount / campaign.goal) * 100;
  const presetAmounts = [10, 25, 50, 100];

  const handleDonate = () => {
    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid donation amount.',
      });
      return;
    }

    toast({
      title: 'Thank you for your donation!',
      description: `You've successfully contributed ${formatCurrency(donationAmount)} to this campaign.`,
      action: <CheckCircle className="text-green-500" />,
    });
    setAmount('');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">
          <span className="text-primary">{formatCurrency(campaign.currentAmount)}</span>
          <span className="text-base text-muted-foreground font-normal"> raised of {formatCurrency(campaign.goal)} goal</span>
        </CardTitle>
        <Progress value={progress} className="h-3" />
        <CardDescription>{Math.round(progress)}% of goal reached</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {presetAmounts.map((preset) => (
            <Button key={preset} variant="outline" onClick={() => setAmount(preset.toString())}>
              {formatCurrency(preset)}
            </Button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            type="number"
            placeholder="Custom Amount"
            className="pl-6"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full" onClick={handleDonate}>
          Donate Now
        </Button>
      </CardFooter>
    </Card>
  );
}
