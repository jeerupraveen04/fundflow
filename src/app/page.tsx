import Link from 'next/link';
import { campaigns } from '@/lib/data';
import { CampaignCard } from '@/components/campaign-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      <section className="text-center py-12 md:py-20 lg:py-24">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground mb-4 font-headline">
          Fund the Future, Flow with Purpose
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 px-4">
          Discover and support inspiring projects from creators around the world. Your contribution can bring amazing ideas to life.
        </p>
        <Button asChild size="lg">
          <Link href="#campaigns">
            Browse Campaigns <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </section>

      <section id="campaigns" className="space-y-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center font-headline">
          Trending Campaigns
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        <div className="text-center pt-8">
          <Button variant="outline">
            Load More
          </Button>
        </div>
      </section>
    </div>
  );
}
