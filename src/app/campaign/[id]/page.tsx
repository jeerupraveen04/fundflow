import { notFound } from 'next/navigation';
import Image from 'next/image';
import { campaigns, type Campaign } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DonationForm } from '@/components/donation-form';

type CampaignPageProps = {
  params: { id: string };
};

export async function generateStaticParams() {
  return campaigns.map((campaign) => ({
    id: campaign.id,
  }));
}

const getCampaign = (id: string): Campaign | undefined => {
  return campaigns.find((campaign) => campaign.id === id);
};

export default function CampaignPage({ params }: CampaignPageProps) {
  const campaign = getCampaign(params.id);

  if (!campaign) {
    notFound();
  }

  const campaignImage = PlaceHolderImages.find(img => img.id === campaign.campaignImageId);
  const creatorAvatar = PlaceHolderImages.find(img => img.id === campaign.creatorAvatarId);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-2">{campaign.category}</Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">{campaign.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden">
            <div className="relative aspect-video w-full">
              {campaignImage && (
                <Image
                  src={campaignImage.imageUrl}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  data-ai-hint={campaignImage.imageHint}
                />
              )}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  {creatorAvatar && <AvatarImage src={creatorAvatar.imageUrl} alt={campaign.creatorName} data-ai-hint={creatorAvatar.imageHint}/>}
                  <AvatarFallback>{campaign.creatorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Created by</p>
                  <p className="text-muted-foreground">{campaign.creatorName}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold text-lg mb-2">About this campaign</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{campaign.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky top-24 h-fit mt-8 lg:mt-0">
          <DonationForm campaign={campaign} />
        </div>
      </div>
    </div>
  );
}
