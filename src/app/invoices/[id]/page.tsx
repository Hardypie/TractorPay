import { notFound } from 'next/navigation';
import { getInvoiceById, getCustomerById } from '@/lib/api';
import PageHeader from '@/components/page-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import { InvoiceActions } from '@/components/invoices/invoice-actions';

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = await getInvoiceById(params.id);
  
  if (!invoice) {
    notFound();
  }

  const customer = await getCustomerById(invoice.customerId);
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <div className="flex flex-col gap-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/invoices">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <PageHeader title={`Invoice ${invoice.invoiceNumber}`} description={`For ${customer?.name || 'Unknown Customer'}`} />
        </div>
        <InvoiceActions />
      </div>

      <Card id="invoice-content">
        <CardHeader className="flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>
                    Date: {format(new Date(invoice.date), 'PPP')} | Due: {format(new Date(invoice.dueDate), 'PPP')}
                </CardDescription>
            </div>
            <Badge
                variant={invoice.status === 'Paid' ? 'default' : invoice.status === 'Overdue' ? 'destructive' : 'secondary'}
                className={cn('text-base', invoice.status === 'Paid' && 'bg-primary/80')}
            >
                {invoice.status}
            </Badge>
        </CardHeader>
        <CardContent>
            <div className="grid gap-8 md:grid-cols-2 mb-8">
                <div>
                    <h3 className="font-semibold mb-2">Bill To:</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p className="font-bold text-foreground">{customer?.name}</p>
                        <p>{customer?.address.street}</p>
                        <p>{customer?.email}</p>
                        <p>{customer?.phone}</p>
                    </div>
                </div>
                <div className="text-left md:text-right">
                    <h3 className="font-semibold mb-2">From:</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p className="font-bold text-foreground">Jai Maa Tara</p>
                        <p>vill batsara gp kajri ps pandwa dist palamu state jharkhand</p>
                        <p>ramanthsinghdto8700@gmail.com</p>
                        <p>9934571673</p>
                    </div>
                </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.quantity * item.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-8 gap-8">
                <div className="text-center">
                    <h3 className="font-semibold mb-2">Scan to Pay</h3>
                    <Image src="/QR.jpg" alt="Payment QR Code" width={150} height={150} />
                </div>
                <div className="text-right w-full sm:w-auto">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>{formatCurrency(invoice.total)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes:</span>
                         <span>{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl mt-2 border-t pt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(invoice.total)}</span>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const dynamic = 'force-dynamic';
