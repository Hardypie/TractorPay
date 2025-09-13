import PageHeader from '@/components/page-header';
import { BrandingForm } from '@/components/settings/branding-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Settings" description="Manage your application settings and branding." />
      <Card>
        <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Customize the branding elements for AI-generated emails.</CardDescription>
        </CardHeader>
        <CardContent>
            <BrandingForm />
        </CardContent>
      </Card>
    </div>
  );
}
