import Link from 'next/link';
import Image from 'next/image';
import type { Campaign } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type CampaignCardProps = {
  campaign: Campaign;
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = (campaign.currentAmount / campaign.goal) * 100;
  const campaignImage = PlaceHolderImages.find(img => img.id === campaign.campaignImageId);
  const creatorAvatar = PlaceHolderImages.find(img => img.id === campaign.creatorAvatarId);

  return (
    <Link href={`/campaign/${campaign.id}`}>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <CardHeader className="p-0 flex-shrink-0">
          <div className="relative h-40 w-full md:h-48 overflow-hidden bg-muted">
            {campaignImage ? (
              <Image
                src={campaignImage.imageUrl}
                alt={campaign.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                data-ai-hint={campaignImage.imageHint}
              />
            ) : (
              <div className="bg-muted h-full w-full" />
            )}
            <Badge className="absolute top-2 right-2" variant="secondary">{campaign.category}</Badge>
          </div>
          <div className="p-4 md:p-6 pb-2">
            <CardTitle className="text-base md:text-lg font-semibold leading-tight line-clamp-2">{campaign.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 mb-4">
            {campaign.description}
          </p>
          <div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between items-center mt-2 text-xs md:text-sm">
              <span className="font-semibold text-primary-foreground">
                {formatCurrency(campaign.currentAmount)} raised
              </span>
              <span className="text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 md:p-6 pt-2 md:pt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 flex-shrink-0">
              {creatorAvatar && <AvatarImage src={creatorAvatar.imageUrl} alt={campaign.creatorName} data-ai-hint={creatorAvatar.imageHint} />}
              <AvatarFallback>{campaign.creatorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs md:text-sm text-muted-foreground truncate">by {campaign.creatorName}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
