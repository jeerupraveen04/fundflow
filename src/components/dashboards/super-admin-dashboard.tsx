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
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { campaigns, Campaign } from "@/lib/data";
import { Check, X, BarChart, Users, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonationHistory } from "./donation-history";


const pendingCampaigns: Campaign[] = [
    {
        ...campaigns[2],
        currentAmount: 0,
    },
    {
        ...campaigns[4],
        currentAmount: 0,
    }
];

const allCampaigns = campaigns;

export function SuperAdminDashboard() {
  const totalRaisedAll = allCampaigns.reduce((sum, c) => sum + c.currentAmount, 0);
  const totalCampaigns = allCampaigns.length;

  return (
    <Tabs defaultValue="super-admin-view">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="super-admin-view">Super Admin View</TabsTrigger>
        <TabsTrigger value="my-donations">My Donations</TabsTrigger>
      </TabsList>
      <TabsContent value="super-admin-view" className="mt-4">
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Platform Revenue</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRaisedAll)}</div>
                <p className="text-xs text-muted-foreground">
                  Across all campaigns
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCampaigns}</div>
                <p className="text-xs text-muted-foreground">
                  Live on the platform
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{pendingCampaigns.length}</div>
                <p className="text-xs text-muted-foreground">
                  Campaigns needing review
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaigns Awaiting Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.title}</TableCell>
                      <TableCell>{campaign.creatorName}</TableCell>
                      <TableCell>{formatCurrency(campaign.goal)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700">
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                            <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
            <Card>
                <CardHeader>
                    <CardTitle>All Campaigns Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campaign</TableHead>
                                <TableHead>Creator</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount Raised</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allCampaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">{campaign.title}</TableCell>
                                    <TableCell>{campaign.creatorName}</TableCell>
                                    <TableCell>
                                        <Badge>Active</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(campaign.currentAmount)}</TableCell>
                                </TableRow>
                            ))}
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
