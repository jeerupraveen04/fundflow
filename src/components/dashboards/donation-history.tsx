import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { campaigns } from "@/lib/data";
import { Heart } from "lucide-react";

const userDonations = [
  {
    campaignId: "help-build-our-community-garden",
    amount: 50,
    date: "2024-05-15",
  },
  {
    campaignId: "paws-for-a-cause-shelter-expansion",
    amount: 100,
    date: "2024-05-10",
  },
  {
    campaignId: "code-connect-next-gen-edtech",
    amount: 25,
    date: "2024-04-28",
  },
  {
    campaignId: "the-aurora-mural-project",
    amount: 75,
    date: "2024-04-20",
  },
];

const donationsWithCampaigns = userDonations.map(donation => {
    const campaign = campaigns.find(c => c.id === donation.campaignId);
    return {
        ...donation,
        campaignTitle: campaign?.title || "Unknown Campaign",
        status: "Completed"
    }
});


export function DonationHistory() {
  const totalDonated = donationsWithCampaigns.reduce((sum, donation) => sum + donation.amount, 0);
  const campaignsSupported = new Set(donationsWithCampaigns.map(d => d.campaignId)).size;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDonated)}</div>
            <p className="text-xs text-muted-foreground">
              Thank you for your generosity!
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Supported</CardTitle>
             <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{campaignsSupported}</div>
            <p className="text-xs text-muted-foreground">
              Making a difference across projects
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donationsWithCampaigns.map((donation, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{donation.campaignTitle}</TableCell>
                  <TableCell>{formatCurrency(donation.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{donation.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
