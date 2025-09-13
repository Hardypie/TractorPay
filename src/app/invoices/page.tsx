import { getCustomers, getInvoices } from '@/lib/api';
import PageHeader from '@/components/page-header';
import { InvoicesTable } from '@/components/invoices/invoices-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default async function InvoicesPage() {
  const [invoices, customers] = await Promise.all([
      getInvoices(),
      getCustomers()
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Invoices" description="View and manage all customer invoices.">
        <Button asChild>
          <Link href="/invoices/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </PageHeader>
      <InvoicesTable invoices={invoices} customers={customers} />
    </div>
  );
}
