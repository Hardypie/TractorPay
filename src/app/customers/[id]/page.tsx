import { notFound } from 'next/navigation';
import { getCustomerById, getInvoicesByCustomerId, getPaymentsByCustomerId } from '@/lib/api';
import PageHeader from '@/components/page-header';
import CustomerDetails from '@/components/customers/customer-details';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function CustomerPage({ params }: { params: { id: string } }) {
  const [customer, payments, invoices] = await Promise.all([
    getCustomerById(params.id),
    getPaymentsByCustomerId(params.id),
    getInvoicesByCustomerId(params.id),
  ]);

  if (!customer) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/customers">
                <ArrowLeft className="h-4 w-4" />
            </Link>
        </Button>
        <PageHeader title={customer.name} description={customer.email} />
      </div>
      <CustomerDetails customer={customer} payments={payments} invoices={invoices} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
