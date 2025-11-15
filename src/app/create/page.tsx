import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateCampaignPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Start Your Campaign</CardTitle>
          <CardDescription>Bring your idea to life. Fill out the details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input id="title" placeholder="e.g., My Awesome Project" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Tell us all about your campaign..." rows={6} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="goal">Funding Goal</Label>
                <Input id="goal" type="number" placeholder="$5,000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="film">Film</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="animals">Animals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Campaign Image</Label>
                <Input id="image" type="file" />
                <p className="text-xs text-muted-foreground">Upload a high-quality image for your campaign.</p>
            </div>
            <Button type="submit" size="lg" className="w-full">Create Campaign</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
