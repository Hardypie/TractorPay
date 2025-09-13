import PageHeader from '@/components/page-header';
import { CreateInvoiceForm } from '@/components/invoices/create-invoice-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCustomers } from '@/lib/api';

export default async function NewInvoicePage() {
  const customers = await getCustomers();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title="Create New Invoice" description="Fill in the details to generate a new invoice." />
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>Please provide the necessary information for the new invoice.</CardDescription>
        </CardHeader>
        <CardContent>
            <CreateInvoiceForm customers={customers} />
        </CardContent>
      </Card>
    </div>
  );
}
