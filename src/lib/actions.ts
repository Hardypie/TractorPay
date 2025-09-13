
"use server"

import { generatePaymentReminderEmail } from "@/ai/flows/payment-reminder-emails";
import type { GeneratePaymentReminderEmailInput } from "@/ai/flows/payment-reminder-emails";
import { addCustomer as apiAddCustomer, addPayment as apiAddPayment, deleteCustomer as apiDeleteCustomer, addInvoice as apiAddInvoice, deleteInvoice as apiDeleteInvoice, updateInvoiceStatus as apiUpdateInvoiceStatus } from '@/lib/api';
import type { Customer, NewPayment, NewInvoice, Invoice } from './types';
import { revalidatePath } from "next/cache";

export async function getReminderEmail(input: GeneratePaymentReminderEmailInput): Promise<{ emailDraft: string } | { error: string }> {
  try {
    const result = await generatePaymentReminderEmail(input);
    return { emailDraft: result.emailDraft };
  } catch (error) {
    console.error("Error generating reminder email:", error);
    return { error: "Failed to generate reminder email. Please try again." };
  }
}

export async function addCustomer(customerData: Omit<Customer, 'id' | 'address'> & {address: string}) {
    try {
        const newCustomer = await apiAddCustomer(customerData);
        revalidatePath('/customers');
        return { customer: newCustomer };
    } catch (error) {
        console.error("Error adding customer:", error);
        return { error: "Failed to add customer. Please try again." };
    }
}

export async function addPayment(paymentData: NewPayment) {
    try {
        await apiAddPayment(paymentData);
        revalidatePath('/customers');
        revalidatePath(`/customers/${paymentData.customerId}`);
    } catch (error) {
        console.error("Error adding payment:", error);
        return { error: "Failed to add payment. Please try again." };
    }
}

export async function deleteCustomer(customerId: string) {
    try {
        await apiDeleteCustomer(customerId);
        revalidatePath('/customers');
    } catch (error) {
        console.error("Error deleting customer:", error);
        return { error: "Failed to delete customer. Please try again." };
    }
}

export async function addInvoice(invoiceData: NewInvoice) {
    try {
        const newInvoice = await apiAddInvoice(invoiceData);
        revalidatePath('/invoices');
        revalidatePath('/customers');
        revalidatePath(`/customers/${invoiceData.customerId}`);
        return { invoice: newInvoice };
    } catch (error) {
        console.error("Error adding invoice:", error);
        return { error: "Failed to add invoice. Please try again." };
    }
}

export async function deleteInvoice(invoiceId: string) {
    try {
        await apiDeleteInvoice(invoiceId);
        revalidatePath('/invoices');
        revalidatePath('/customers');
    } catch (error) {
        console.error("Error deleting invoice:", error);
        return { error: "Failed to delete invoice. Please try again." };
    }
}

export async function updateInvoiceStatus(invoiceId: string, status: Invoice['status']) {
    try {
        await apiUpdateInvoiceStatus(invoiceId, status);
        revalidatePath('/invoices');
        revalidatePath('/customers');
    } catch (error) {
        console.error("Error updating invoice status:", error);
        return { error: "Failed to update invoice status. Please try again." };
    }
}
