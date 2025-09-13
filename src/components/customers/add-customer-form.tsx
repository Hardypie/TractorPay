'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addCustomer } from '@/lib/actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import React from 'react';

const formSchema = z.object({
  jobCardNumber: z.string().min(1, "Job card number is required"),
  name: z.string().min(1, "Full name is required"),
  fatherOrHusbandName: z.string().min(1, "Father's/Husband's name is required"),
  phone: z.string().min(1, "Mobile number is required"),
  aadhaarNumber: z.string().min(1, "Aadhaar number is required"),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  ifscCode: z.string().min(1, "IFSC code is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
});

const billingSchema = z.object({
    totalBilled: z.coerce.number().min(0, "Total billed must be a positive number."),
    totalPaid: z.coerce.number().min(0, "Total paid must be a positive number.")
})

export function AddCustomerForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [customerData, setCustomerData] = React.useState<z.infer<typeof formSchema> | null>(null);
  const [isBillingDialogOpen, setIsBillingDialogOpen] = React.useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        jobCardNumber: '',
        name: '',
        fatherOrHusbandName: '',
        phone: '',
        aadhaarNumber: '',
        bankAccountNumber: '',
        bankName: '',
        ifscCode: '',
        address: '',
        email: '',
    },
  });

  const billingForm = useForm<z.infer<typeof billingSchema>>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
        totalBilled: 0,
        totalPaid: 0,
    }
  });

  async function onCustomerSubmit(values: z.infer<typeof formSchema>) {
    setCustomerData(values);
    setIsBillingDialogOpen(true);
  }

  async function onBillingSubmit(values: z.infer<typeof billingSchema>) {
    if (!customerData) return;

    const fullCustomerData = { 
        ...customerData, 
        totalBilled: values.totalBilled,
        remainingBalance: values.totalBilled - values.totalPaid
    };

    const result = await addCustomer(fullCustomerData);

    if (result && 'error' in result) {
        toast({
            variant: 'destructive',
            title: 'Failed to Save Customer',
            description: result.error,
        });
    } else {
        toast({
          title: 'Customer Saved',
          description: 'The new customer details have been saved successfully.',
        });
        setIsBillingDialogOpen(false);
        router.push('/customers');
        router.refresh();
    }
  }


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onCustomerSubmit)} className="space-y-8 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobCardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Card Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job card number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fatherOrHusbandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's/Husband's Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter father's/husband's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aadhaarNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhaar Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Aadhaar number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                control={form.control}
                name="bankAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bank name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter IFSC code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                  <Textarea placeholder="Enter full address" {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />
          <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit">Save Customer Details</Button>
              <Button type="button" variant="secondary" onClick={() => form.reset()}>Reset Form</Button>
          </div>
        </form>
      </Form>
      <Dialog open={isBillingDialogOpen} onOpenChange={setIsBillingDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Enter Billing Details</DialogTitle>
                <DialogDescription>Please provide the initial billing information for {customerData?.name}.</DialogDescription>
            </DialogHeader>
            <Form {...billingForm}>
                <form onSubmit={billingForm.handleSubmit(onBillingSubmit)} className="space-y-4">
                    <FormField
                        control={billingForm.control}
                        name="totalBilled"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Billed</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={billingForm.control}
                        name="totalPaid"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Paid</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setIsBillingDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Billing Details</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
