'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Customer, Payment, Invoice } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import PaymentReminder from './payment-reminder';

interface CustomerDetailsProps {
  customer: Customer;
  payments: Payment[];
  invoices: Invoice[];
}

export default function CustomerDetails({ customer, payments, invoices }: CustomerDetailsProps) {
  const upcomingDueDate = invoices.find(inv => inv.status === 'Pending' || inv.status === 'Overdue');
  const totalPaid = customer.totalBilled - customer.remainingBalance;
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="reminders">AI Reminders</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(customer.totalBilled)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalPaid)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(customer.remainingBalance)}</p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Phone:</strong> {customer.phone}</p>
              <p><strong>Address:</strong> {customer.address.street}</p>
            </CardContent>
          </Card>
          {upcomingDueDate && (
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Upcoming Due Date</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl font-semibold">Invoice {upcomingDueDate.invoiceNumber} is due on {format(new Date(upcomingDueDate.dueDate), 'MMMM dd, yyyy')}</p>
                    <p className="text-muted-foreground">Amount: {formatCurrency(upcomingDueDate.total)}</p>
                </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{format(new Date(payment.date), 'PPP p')}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && <TableRow><TableCell colSpan={3} className="text-center">No payments found.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="invoices">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{format(new Date(invoice.date), 'PPP')}</TableCell>
                    <TableCell>{format(new Date(invoice.dueDate), 'PPP')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === 'Paid'
                            ? 'default'
                            : invoice.status === 'Overdue'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className={cn(invoice.status === 'Paid' && 'bg-primary/80')}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.total)}</TableCell>
                  </TableRow>
                ))}
                 {invoices.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No invoices found.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reminders">
        <PaymentReminder customer={customer} invoices={invoices} />
      </TabsContent>
    </Tabs>
  );
}
