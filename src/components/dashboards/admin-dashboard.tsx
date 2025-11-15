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
import { campaigns, Campaign } from "@/lib/data";
import { Progress } from "../ui/progress";
import { Users, Target, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonationHistory } from "./donation-history";

// Mock data for admin's campaigns
const adminCampaigns: Campaign[] = campaigns.slice(0, 2); // Taking first 2 campaigns as admin's

export function AdminDashboard() {
    const totalRaised = adminCampaigns.reduce((sum, campaign) => sum + campaign.currentAmount, 0);
    const totalDonors = 345; // Mock data
    
  return (
    <Tabs defaultValue="admin-view">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="admin-view">Admin View</TabsTrigger>
        <TabsTrigger value="my-donations">My Donations</TabsTrigger>
      </TabsList>
      <TabsContent value="admin-view" className="mt-4">
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRaised)}</div>
                <p className="text-xs text-muted-foreground">
                  Across all your campaigns
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{totalDonors}</div>
                <p className="text-xs text-muted-foreground">
                  Unique supporters for your causes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminCampaigns.length}</div>
                <p className="text-xs text-muted-foreground">
                    Campaigns you are currently running
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>My Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Amount Raised</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminCampaigns.map((campaign) => {
                    const progress = (campaign.currentAmount / campaign.goal) * 100;
                    return (
                        <TableRow key={campaign.id}>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">Active</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={progress} className="h-2 w-24" />
                                    <span>{Math.round(progress)}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(campaign.currentAmount)}</TableCell>
                        </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="my-donations" className="mt-4">
        <DonationHistory />
      </TabsContent>
    </Tabs>
  );
}
