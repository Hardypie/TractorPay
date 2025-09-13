'use client';

import { useState } from 'react';
import type { Customer, Invoice } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getReminderEmail } from '@/lib/actions';
import { Mail, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { BrandingSettings } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface PaymentReminderProps {
  customer: Customer;
  invoices: Invoice[];
}

export default function PaymentReminder({ customer, invoices }: PaymentReminderProps) {
  const { toast } = useToast();
  const [brandingSettings] = useLocalStorage<BrandingSettings>('brandingSettings', {});
  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | undefined>(pendingInvoices[0]?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');

  const selectedInvoice = pendingInvoices.find(inv => inv.id === selectedInvoiceId);
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const handleGenerateEmail = async () => {
    if (!selectedInvoice) {
      toast({
        variant: 'destructive',
        title: 'No Invoice Selected',
        description: 'Please select an invoice to generate a reminder.',
      });
      return;
    }

    setIsLoading(true);
    setEmailDraft('');
    const brandingElements = `Logo: ${brandingSettings?.logo || 'Default Logo'}, Colors: Primary - ${brandingSettings?.colors?.primary || '#4CAF50'}, Secondary - ${brandingSettings?.colors?.secondary || '#795548'}`;
    
    const result = await getReminderEmail({
      customerName: customer.name,
      amountDue: selectedInvoice.total,
      dueDate: selectedInvoice.dueDate,
      brandingElements: brandingElements,
    });
    
    setIsLoading(false);
    if ('emailDraft' in result) {
      setEmailDraft(result.emailDraft);
      toast({
        title: 'Email Draft Generated!',
        description: 'The payment reminder email has been created below.',
      });
    } else {
        toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: result.error,
        });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailDraft);
    toast({ title: "Copied to clipboard!" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Payment Reminder</CardTitle>
        <CardDescription>
          Use AI to generate a personalized payment reminder email for an outstanding invoice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="invoice-select">Select an Invoice</Label>
            <Select onValueChange={setSelectedInvoiceId} defaultValue={selectedInvoiceId} disabled={pendingInvoices.length === 0}>
                <SelectTrigger id="invoice-select" className="w-full md:w-1/2">
                    <SelectValue placeholder="Select an invoice" />
                </SelectTrigger>
                <SelectContent>
                    {pendingInvoices.map(inv => (
                        <SelectItem key={inv.id} value={inv.id}>
                            {inv.invoiceNumber} - {formatCurrency(inv.total)} due on {inv.dueDate}
                        </SelectItem>
                    ))}
                    {pendingInvoices.length === 0 && <SelectItem value="none" disabled>No pending invoices</SelectItem>}
                </SelectContent>
            </Select>
        </div>

        <Button onClick={handleGenerateEmail} disabled={isLoading || !selectedInvoiceId}>
          {isLoading ? 'Generating...' : 'Generate Email'}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>

        {(isLoading || emailDraft) && (
             <div className="space-y-4 pt-4">
                <Label htmlFor="email-draft">Generated Email Draft</Label>
                {isLoading && <Skeleton className="w-full h-48" />}
                {emailDraft && (
                    <>
                        <Textarea id="email-draft" value={emailDraft} readOnly rows={10} />
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={copyToClipboard}>Copy Text</Button>
                            <Button>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email (Simulation)
                            </Button>
                        </div>
                    </>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
