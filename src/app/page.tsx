import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Users, FileText, Tractor } from 'lucide-react';
import { getCustomers, getInvoices, getPayments } from '@/lib/api';
import { InvoicesTable } from '@/components/invoices/invoices-table';
import PageHeader from '@/components/page-header';
import { MonthlyRevenueChart } from '@/components/dashboard/monthly-revenue-chart';
import { subMonths, format, startOfMonth } from 'date-fns';
import type { Payment } from '@/lib/types';

export default async function DashboardPage() {
  const [customers, payments, invoices] = await Promise.all([
    getCustomers(),
    getPayments(),
    getInvoices(),
  ]);

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status === 'Overdue'
  ).length;

  const recentInvoices = invoices.slice(0, 5);
  const formattedTotalRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(totalRevenue);
  
  const processChartData = (payments: Payment[]) => {
    const monthlyRevenue: { [key: string]: number } = {};
    const today = new Date();

    // Initialize the last 12 months with 0 revenue
    for (let i = 0; i < 12; i++) {
      const month = format(subMonths(today, i), 'MMM yyyy');
      monthlyRevenue[month] = 0;
    }

    payments.forEach(payment => {
      const paymentMonth = format(new Date(payment.date), 'MMM yyyy');
      if (monthlyRevenue.hasOwnProperty(paymentMonth)) {
        monthlyRevenue[paymentMonth] += payment.amount;
      }
    });

    return Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({ month, revenue }))
      .reverse(); // To have the most recent month last
  };

  const chartData = processChartData(payments);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formattedTotalRevenue}
            </div>
            <p className="text-xs text-muted-foreground">
              Total amount received from customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Total active customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">
              Total invoices generated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Invoices past their due date
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyRevenueChart data={chartData} />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
        <InvoicesTable invoices={recentInvoices} customers={customers} />
      </div>
    </div>
  );
}
