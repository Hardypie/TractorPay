'use client';

import type { Invoice, Customer } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteInvoice, updateInvoiceStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

async function handleDelete(invoiceId: string, toast: any, router: any) {
    const result = await deleteInvoice(invoiceId);
    if (result && 'error' in result) {
      toast({
        variant: 'destructive',
        title: 'Failed to Delete Invoice',
        description: result.error,
      });
    } else {
      toast({
        title: 'Invoice Deleted',
        description: 'The invoice has been deleted successfully.',
      });
      router.refresh();
    }
}

async function handleStatusUpdate(invoiceId: string, status: Invoice['status'], toast: any, router: any) {
    const result = await updateInvoiceStatus(invoiceId, status);
     if (result && 'error' in result) {
      toast({
        variant: 'destructive',
        title: 'Failed to Update Status',
        description: result.error,
      });
    } else {
      toast({
        title: 'Invoice Status Updated',
        description: `The invoice has been marked as ${status}.`,
      });
      router.refresh();
    }
}

export const getInvoiceColumns = (customers: Customer[]): ColumnDef<Invoice>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'invoiceNumber',
    header: 'Invoice',
    cell: ({ row }) => <div className="font-medium">{row.getValue('invoiceNumber')}</div>,
  },
  {
    accessorKey: 'customerId',
    header: 'Customer',
    cell: ({ row }) => {
        const customer = customers.find(c => c.id === row.getValue('customerId'));
        return customer ? <Link href={`/customers/${customer.id}`} className="hover:underline">{customer.name}</Link> : 'Unknown';
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => format(new Date(row.getValue('date')), 'MMM d, yyyy'),
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }) => format(new Date(row.getValue('dueDate')), 'MMM d, yyyy'),
  },
  {
    accessorKey: 'total',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total'));
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
            <Badge
                variant={status === 'Paid' ? 'default' : status === 'Overdue' ? 'destructive' : 'secondary'}
                className={cn(status === 'Paid' && 'bg-primary/80')}
            >
                {status}
            </Badge>
        )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
        const invoice = row.original;
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
        const { toast } = useToast();
        const router = useRouter();

        return (
            <div className="text-right">
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this invoice?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the invoice.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDelete(invoice.id, toast, router)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/invoices/${invoice.id}`}>View invoice</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        disabled={invoice.status === 'Paid'}
                        onSelect={() => handleStatusUpdate(invoice.id, 'Paid', toast, router)}>
                        Mark as paid
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onSelect={() => setIsDeleteDialogOpen(true)}
                        className="text-destructive">
                        Delete invoice
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    },
  },
];
