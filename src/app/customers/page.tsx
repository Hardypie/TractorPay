import { getCustomers } from '@/lib/api';
import PageHeader from '@/components/page-header';
import { CustomersTable } from '@/components/customers/customers-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Customers" description="Manage your customer profiles and payments.">
        <Button asChild>
          <Link href="/customers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customer
          </Link>
        </Button>
      </PageHeader>
      <CustomersTable data={customers} />
    </div>
  );
}
