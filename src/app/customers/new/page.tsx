import PageHeader from '@/components/page-header';
import { AddCustomerForm } from '@/components/customers/add-customer-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewCustomerPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title="Add New Customer" description="Fill in the details to create a new customer profile." />
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Customer Details</CardTitle>
            <CardDescription>Please provide the necessary information for the new customer.</CardDescription>
        </CardHeader>
        <CardContent>
            <AddCustomerForm />
        </CardContent>
      </Card>
    </div>
  );
}
