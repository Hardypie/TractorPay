
import 'server-only';
import { customers as localCustomers, payments as localPayments, invoices as localInvoices } from './data';
import type { Customer, Payment, NewPayment, Invoice, NewInvoice } from './types';
import fs from 'fs/promises';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { parse } from 'csv-parse/sync';


async function fetchCustomersFromSheet(): Promise<Customer[]> {
  const csvPath = path.join(process.cwd(), 'public', 'customers.csv');
  try {
    const csvText = await fs.readFile(csvPath, 'utf-8');
    const records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
    });

    const sheetCustomers: Customer[] = records.map((row: any, index: number) => {
      const {
        jobCardNumber,
        name,
        fatherOrHusbandName,
        phone,
        aadhaarNumber,
        bankAccountNumber,
        bankName,
        ifscCode,
        address,
        email,
        totalBilled,
        totalPaid,
        remainingBalance,
      } = row;

      const billed = parseFloat(totalBilled) || 0;
      const paid = parseFloat(totalPaid) || 0;
      const balance = parseFloat(remainingBalance) || 0;

      return {
        id: `csv-${index + 1}`,
        jobCardNumber,
        name,
        fatherOrHusbandName,
        phone,
        aadhaarNumber,
        bankAccountNumber,
        bankName,
        ifscCode,
        address: {
            street: address,
            city: '',
            state: '',
            zip: ''
        },
        email,
        totalBilled: billed,
        totalPaid: paid,
        remainingBalance: balance,
      };
    }).filter((c: Customer) => c.name); // Filter out any empty rows
    return sheetCustomers;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        const csvWriter = createObjectCsvWriter({
            path: csvPath,
            header: [
                {id: 'jobCardNumber', title: 'jobCardNumber'},
                {id: 'name', title: 'name'},
                {id: 'fatherOrHusbandName', title: 'fatherOrHusbandName'},
                {id: 'phone', title: 'phone'},
                {id: 'aadhaarNumber', title: 'aadhaarNumber'},
                {id: 'bankAccountNumber', title: 'bankAccountNumber'},
                {id: 'bankName', title: 'bankName'},
                {id: 'ifscCode', title: 'ifscCode'},
                {id: 'address', title: 'address'},
                {id: 'email', title: 'email'},
                {id: 'totalBilled', title: 'totalBilled'},
                {id: 'totalPaid', title: 'totalPaid'},
                {id: 'remainingBalance', title: 'remainingBalance'},
            ],
        });
        await csvWriter.writeRecords([]);
        console.log('customers.csv not found, created a new one.');
        return [];
    }
    console.error('Error fetching customers from sheet:', error);
    return [];
  }
}

async function fetchPaymentsFromSheet(): Promise<Payment[]> {
    const csvPath = path.join(process.cwd(), 'public', 'payments.csv');
    try {
        await fs.access(csvPath);
    } catch (error) {
        // File doesn't exist, create it with headers
        const csvWriter = createObjectCsvWriter({
            path: csvPath,
            header: [
                {id: 'id', title: 'id'},
                {id: 'customerId', title: 'customerId'},
                {id: 'amount', title: 'amount'},
                {id: 'date', title: 'date'},
                {id: 'method', title: 'method'},
            ],
        });
        await csvWriter.writeRecords([]);
        return [];
    }
    
    try {
        const csvText = await fs.readFile(csvPath, 'utf-8');
        if (!csvText.trim()) return []; // Handle empty file
        const records = parse(csvText, {
            columns: true,
            skip_empty_lines: true,
        });

        const sheetPayments: Payment[] = records.map((row: any) => ({
            id: row.id,
            customerId: row.customerId,
            amount: parseFloat(row.amount),
            date: row.date,
            method: row.method as any,
        }));
        return sheetPayments;
    } catch (error) {
        console.error('Error fetching payments from sheet:', error);
        return [];
    }
}

async function fetchInvoicesFromSheet(): Promise<Invoice[]> {
    const csvPath = path.join(process.cwd(), 'public', 'invoices.csv');
    try {
        await fs.access(csvPath);
    } catch (error) {
        const csvWriter = createObjectCsvWriter({
            path: csvPath,
            header: [
                {id: 'id', title: 'id'},
                {id: 'customerId', title: 'customerId'},
                {id: 'invoiceNumber', title: 'invoiceNumber'},
                {id: 'date', title: 'date'},
                {id: 'dueDate', title: 'dueDate'},
                {id: 'items', title: 'items'},
                {id: 'total', title: 'total'},
                {id: 'status', title: 'status'},
            ],
        });
        await csvWriter.writeRecords([]);
        return [];
    }

    try {
        const csvText = await fs.readFile(csvPath, 'utf-8');
        if (!csvText.trim()) return [];
        const records = parse(csvText, {
            columns: true,
            skip_empty_lines: true,
        });

        const sheetInvoices: Invoice[] = records.map((row: any) => ({
            id: row.id,
            customerId: row.customerId,
            invoiceNumber: row.invoiceNumber,
            date: row.date,
            dueDate: row.dueDate,
            items: JSON.parse(row.items),
            total: parseFloat(row.total),
            status: row.status as any,
        }));
        return sheetInvoices;
    } catch (error) {
        console.error('Error fetching invoices from sheet:', error);
        return [];
    }
}

async function writeInvoicesToSheet(invoices: Invoice[]) {
    const csvPath = path.join(process.cwd(), 'public', 'invoices.csv');
    const csvWriter = createObjectCsvWriter({
        path: csvPath,
        header: [
            {id: 'id', title: 'id'},
            {id: 'customerId', title: 'customerId'},
            {id: 'invoiceNumber', title: 'invoiceNumber'},
            {id: 'date', title: 'date'},
            {id: 'dueDate', title: 'dueDate'},
            {id: 'items', title: 'items'},
            {id: 'total', title: 'total'},
            {id: 'status', title: 'status'},
        ],
    });
    const records = invoices.map(inv => ({...inv, items: JSON.stringify(inv.items)}));
    await csvWriter.writeRecords(records);
}

export async function getCustomers(): Promise<Customer[]> {
  return new Promise(async (resolve) => {
    const sheetCustomers = await fetchCustomersFromSheet();
    setTimeout(() => resolve([...sheetCustomers, ...localCustomers]), 500);
  });
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
   const allCustomers = await getCustomers();
   return new Promise((resolve) =>
    setTimeout(() => resolve(allCustomers.find((c) => c.id === id)), 500)
  );
}

export async function addCustomer(customerData: Omit<Customer, 'id' | 'address'> & {address: string}): Promise<Customer> {
    const csvPath = path.join(process.cwd(), 'public', 'customers.csv');
    const allCustomers = await fetchCustomersFromSheet();
    const newId = `csv-${Date.now()}`;
    
    const newCustomerRecord = {
        ...customerData,
        id: newId,
    }

    const csvWriter = createObjectCsvWriter({
        path: csvPath,
        header: [
            {id: 'jobCardNumber', title: 'jobCardNumber'},
            {id: 'name', title: 'name'},
            {id: 'fatherOrHusbandName', title: 'fatherOrHusbandName'},
            {id: 'phone', title: 'phone'},
            {id: 'aadhaarNumber', title: 'aadhaarNumber'},
            {id: 'bankAccountNumber', title: 'bankAccountNumber'},
            {id: 'bankName', title: 'bankName'},
            {id: 'ifscCode', title: 'ifscCode'},
            {id: 'address', title: 'address'},
            {id: 'email', title: 'email'},
            {id: 'totalBilled', title: 'totalBilled'},
            {id: 'totalPaid', title: 'totalPaid'},
            {id: 'remainingBalance', title: 'remainingBalance'},
        ],
        append: true,
    });

    await csvWriter.writeRecords([newCustomerRecord]);

    const newCustomer: Customer = {
        ...customerData,
        id: newId,
        address: {
            street: customerData.address,
            city: '',
            state: '',
            zip: ''
        },
    }

    return newCustomer;
}


export async function getPayments(): Promise<Payment[]> {
    const sheetPayments = await fetchPaymentsFromSheet();
    return new Promise((resolve) => setTimeout(() => resolve([...sheetPayments, ...localPayments]), 500));
}

export async function getPaymentsByCustomerId(customerId: string): Promise<Payment[]> {
    const allPayments = await getPayments();
    return new Promise((resolve) =>
        setTimeout(() => resolve(allPayments.filter((p) => p.customerId === customerId)), 500)
    );
}

export async function addPayment(payment: NewPayment): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Update customer's balance in customers.csv
            const customersCsvPath = path.join(process.cwd(), 'public', 'customers.csv');
            const allCustomers = await fetchCustomersFromSheet();
            const customerIndex = allCustomers.findIndex(c => c.id === payment.customerId);

            if (customerIndex === -1) {
                 const localCustomerIndex = localCustomers.findIndex(c => c.id === payment.customerId);
                 if (localCustomerIndex !== -1) {
                    localCustomers[localCustomerIndex].remainingBalance -= payment.amount;
                    localCustomers[localCustomerIndex].totalPaid += payment.amount;
                 } else {
                    return reject(new Error("Customer not found"));
                 }
            } else {
                const customer = allCustomers[customerIndex];
                customer.remainingBalance -= payment.amount;
                customer.totalPaid += payment.amount;
                
                const csvWriter = createObjectCsvWriter({
                    path: customersCsvPath,
                    header: [
                        {id: 'jobCardNumber', title: 'jobCardNumber'},
                        {id: 'name', title: 'name'},
                        {id: 'fatherOrHusbandName', title: 'fatherOrHusbandName'},
                        {id: 'phone', title: 'phone'},
                        {id: 'aadhaarNumber', title: 'aadhaarNumber'},
                        {id: 'bankAccountNumber', title: 'bankAccountNumber'},
                        {id: 'bankName', title: 'bankName'},
                        {id: 'ifscCode', title: 'ifscCode'},
                        {id: 'address', title: 'address'},
                        {id: 'email', title: 'email'},
                        {id: 'totalBilled', title: 'totalBilled'},
                        {id: 'totalPaid', title: 'totalPaid'},
                        {id: 'remainingBalance', title: 'remainingBalance'},
                    ],
                    append: false,
                });

                const recordsToSave = allCustomers.map(c => ({
                  ...c,
                  address: c.address.street, 
                }));

                await csvWriter.writeRecords(recordsToSave);
            }

            // 2. Add new payment record to payments.csv
            const paymentsCsvPath = path.join(process.cwd(), 'public', 'payments.csv');
            const newPaymentRecord = {
                id: `payment-${Date.now()}`,
                ...payment
            };

            const paymentCsvWriter = createObjectCsvWriter({
                path: paymentsCsvPath,
                header: [
                    {id: 'id', title: 'id'},
                    {id: 'customerId', title: 'customerId'},
                    {id: 'amount', title: 'amount'},
                    {id: 'date', title: 'date'},
                    {id: 'method', title: 'method'},
                ],
                append: true,
            });

            await paymentCsvWriter.writeRecords([newPaymentRecord]);

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export async function deleteCustomer(customerId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            // Delete from customers.csv
            const customersCsvPath = path.join(process.cwd(), 'public', 'customers.csv');
            const allCustomers = await fetchCustomersFromSheet();
            const updatedCustomers = allCustomers.filter(c => c.id !== customerId);

            const customerCsvWriter = createObjectCsvWriter({
                path: customersCsvPath,
                header: [
                    {id: 'jobCardNumber', title: 'jobCardNumber'},
                    {id: 'name', title: 'name'},
                    {id: 'fatherOrHusbandName', title: 'fatherOrHusbandName'},
                    {id: 'phone', title: 'phone'},
                    {id: 'aadhaarNumber', title: 'aadhaarNumber'},
                    {id: 'bankAccountNumber', title: 'bankAccountNumber'},
                    {id: 'bankName', title: 'bankName'},
                    {id: 'ifscCode', title: 'ifscCode'},
                    {id: 'address', title: 'address'},
                    {id: 'email', title: 'email'},
                    {id: 'totalBilled', title: 'totalBilled'},
                    {id: 'totalPaid', title: 'totalPaid'},
                    {id: 'remainingBalance', title: 'remainingBalance'},
                ],
                append: false,
            });
             const recordsToSave = updatedCustomers.map(c => ({
                  ...c,
                  address: c.address.street, 
                }));
            await customerCsvWriter.writeRecords(recordsToSave);

            // Delete associated payments from payments.csv
            const paymentsCsvPath = path.join(process.cwd(), 'public', 'payments.csv');
            const allPayments = await fetchPaymentsFromSheet();
            const updatedPayments = allPayments.filter(p => p.customerId !== customerId);
            
            const paymentCsvWriter = createObjectCsvWriter({
                path: paymentsCsvPath,
                header: [
                    {id: 'id', title: 'id'},
                    {id: 'customerId', title: 'customerId'},
                    {id: 'amount', title: 'amount'},
                    {id: 'date', title: 'date'},
                    {id: 'method', title: 'method'},
                ],
                append: false,
            });

            await paymentCsvWriter.writeRecords(updatedPayments);

            resolve();

        } catch (error) {
            reject(error)
        }
    });
}

export async function getInvoices(): Promise<Invoice[]> {
    const sheetInvoices = await fetchInvoicesFromSheet();
    return new Promise((resolve) => setTimeout(() => resolve([...sheetInvoices, ...localInvoices]), 500));
}

export async function getInvoicesByCustomerId(customerId: string): Promise<Invoice[]> {
  const allInvoices = await getInvoices();
  return new Promise((resolve) =>
    setTimeout(() => resolve(allInvoices.filter((i) => i.customerId === customerId)), 500)
  );
}

export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
    const allInvoices = await getInvoices();
    return new Promise((resolve) =>
      setTimeout(() => resolve(allInvoices.find((i) => i.id === id)), 500)
    );
}

export async function addInvoice(invoice: NewInvoice): Promise<Invoice> {
    return new Promise(async (resolve, reject) => {
        try {
             // 1. Update customer's balance in customers.csv
            const customersCsvPath = path.join(process.cwd(), 'public', 'customers.csv');
            const allCustomers = await fetchCustomersFromSheet();
            const customerIndex = allCustomers.findIndex(c => c.id === invoice.customerId);
            
            if (customerIndex !== -1) {
                const customer = allCustomers[customerIndex];
                customer.totalBilled += invoice.total;
                customer.remainingBalance += invoice.total;

                const csvWriter = createObjectCsvWriter({
                    path: customersCsvPath,
                    header: [
                        {id: 'jobCardNumber', title: 'jobCardNumber'},
                        {id: 'name', title: 'name'},
                        {id: 'fatherOrHusbandName', title: 'fatherOrHusbandName'},
                        {id: 'phone', title: 'phone'},
                        {id: 'aadhaarNumber', title: 'aadhaarNumber'},
                        {id: 'bankAccountNumber', title: 'bankAccountNumber'},
                        {id: 'bankName', title: 'bankName'},
                        {id: 'ifscCode', title: 'ifscCode'},
                        {id: 'address', title: 'address'},
                        {id: 'email', title: 'email'},
                        {id: 'totalBilled', title: 'totalBilled'},
                        {id: 'totalPaid', title: 'totalPaid'},
                        {id: 'remainingBalance', title: 'remainingBalance'},
                    ],
                    append: false,
                });
                 const recordsToSave = allCustomers.map(c => ({
                      ...c,
                      address: c.address.street, 
                    }));
                await csvWriter.writeRecords(recordsToSave);
            }


            // 2. Add new invoice record to invoices.csv
            const invoicesCsvPath = path.join(process.cwd(), 'public', 'invoices.csv');
            const newId = `inv-${Date.now()}`;
            const newInvoiceRecord: Invoice = {
                id: newId,
                ...invoice,
                date: invoice.date.toISOString(),
                dueDate: invoice.dueDate.toISOString(),
            };

            const invoiceCsvWriter = createObjectCsvWriter({
                path: invoicesCsvPath,
                header: [
                    {id: 'id', title: 'id'},
                    {id: 'customerId', title: 'customerId'},
                    {id: 'invoiceNumber', title: 'invoiceNumber'},
                    {id: 'date', title: 'date'},
                    {id: 'dueDate', title: 'dueDate'},
                    {id: 'items', title: 'items'},
                    {id: 'total', title: 'total'},
                    {id: 'status', title: 'status'},
                ],
                append: true,
            });

            await invoiceCsvWriter.writeRecords([{
                ...newInvoiceRecord,
                items: JSON.stringify(newInvoiceRecord.items)
            }]);

            resolve(newInvoiceRecord);
        } catch (error) {
            reject(error);
        }
    });
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const allInvoices = await fetchInvoicesFromSheet();
            const invoiceToDelete = allInvoices.find(inv => inv.id === invoiceId);
            const updatedInvoices = allInvoices.filter(inv => inv.id !== invoiceId);
            
            await writeInvoicesToSheet(updatedInvoices);

            if (invoiceToDelete) {
                // Adjust customer balance
                const customersCsvPath = path.join(process.cwd(), 'public', 'customers.csv');
                const allCustomers = await fetchCustomersFromSheet();
                const customerIndex = allCustomers.findIndex(c => c.id === invoiceToDelete.customerId);

                if (customerIndex !== -1) {
                    const customer = allCustomers[customerIndex];
                    customer.totalBilled -= invoiceToDelete.total;
                    if (invoiceToDelete.status !== 'Paid') {
                        customer.remainingBalance -= invoiceToDelete.total;
                    }
                    const recordsToSave = allCustomers.map(c => ({
                        ...c,
                        address: c.address.street, 
                    }));

                    const csvWriter = createObjectCsvWriter({ path: customersCsvPath, header: [
                        {id: 'jobCardNumber', title: 'jobCardNumber'},
                        {id: 'name', title: 'name'},
                        {id: 'fatherOrHusbandName', title: 'fatherOrHusbandName'},
                        {id: 'phone', title: 'phone'},
                        {id: 'aadhaarNumber', title: 'aadhaarNumber'},
                        {id: 'bankAccountNumber', title: 'bankAccountNumber'},
                        {id: 'bankName', title: 'bankName'},
                        {id: 'ifscCode', title: 'ifscCode'},
                        {id: 'address', title: 'address'},
                        {id: 'email', title: 'email'},
                        {id: 'totalBilled', title: 'totalBilled'},
                        {id: 'totalPaid', title: 'totalPaid'},
                        {id: 'remainingBalance', title: 'remainingBalance'},
                    ]});
                    await csvWriter.writeRecords(recordsToSave);
                }
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}


export async function updateInvoiceStatus(invoiceId: string, status: Invoice['status']): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const allInvoices = await fetchInvoicesFromSheet();
            const invoiceIndex = allInvoices.findIndex(inv => inv.id === invoiceId);

            if (invoiceIndex === -1) {
                return reject(new Error("Invoice not found"));
            }
            
            const invoice = allInvoices[invoiceIndex];
            const oldStatus = invoice.status;
            invoice.status = status;

            await writeInvoicesToSheet(allInvoices);

            // Adjust customer balance if status changes to/from Paid
            if (oldStatus !== 'Paid' && status === 'Paid') {
                 const customersCsvPath = path.join(process.cwd(), 'public', 'customers.csv');
                const allCustomers = await fetchCustomersFromSheet();
                const customerIndex = allCustomers.findIndex(c => c.id === invoice.customerId);

                if (customerIndex !== -1) {
                    const customer = allCustomers[customerIndex];
                    customer.totalPaid += invoice.total;
                    customer.remainingBalance -= invoice.total;
                    const recordsToSave = allCustomers.map(c => ({ ...c, address: c.address.street, }));
                    const csvWriter = createObjectCsvWriter({ path: customersCsvPath, header: [
                        {id: 'jobCardNumber', title: 'jobCardNumber'},
                        {id: 'name', title: 'name'},
                        {id: 'fatherOrHusbandName', title: 'fatherOrHusbandName'},
                        {id: 'phone', title: 'phone'},
                        {id: 'aadhaarNumber', title: 'aadhaarNumber'},
                        {id: 'bankAccountNumber', title: 'bankAccountNumber'},
                        {id: 'bankName', title: 'bankName'},
                        {id: 'ifscCode', title: 'ifscCode'},
                        {id: 'address', title: 'address'},
                        {id: 'email', title: 'email'},
                        {id: 'totalBilled', title: 'totalBilled'},
                        {id: 'totalPaid', title: 'totalPaid'},
                        {id: 'remainingBalance', title: 'remainingBalance'},
                    ]});
                    await csvWriter.writeRecords(recordsToSave);
                }
            } else if (oldStatus === 'Paid' && status !== 'Paid') {
                 const customersCsvPath = path.join(process.cwd(), 'public', 'customers.csv');
                const allCustomers = await fetchCustomersFromSheet();
                const customerIndex = allCustomers.findIndex(c => c.id === invoice.customerId);
                if (customerIndex !== -1) {
                    const customer = allCustomers[customerIndex];
                    customer.totalPaid -= invoice.total;
                    customer.remainingBalance += invoice.total;
                    const recordsToSave = allCustomers.map(c => ({ ...c, address: c.address.street, }));
                     const csvWriter = createObjectCsvWriter({ path: customersCsvPath, header: [
                        {id: 'jobCardNumber', title: 'jobCardNumber'},
                        {id: 'name', title: 'name'},
                        {id: 'fatherOrHusbandName', title: 'fatherOrHusbandName'},
                        {id: 'phone', title: 'phone'},
                        {id: 'aadhaarNumber', title: 'aadhaarNumber'},
                        {id: 'bankAccountNumber', title: 'bankAccountNumber'},
                        {id: 'bankName', title: 'bankName'},
                        {id: 'ifscCode', title: 'ifscCode'},
                        {id: 'address', title: 'address'},
                        {id: 'email', title: 'email'},
                        {id: 'totalBilled', title: 'totalBilled'},
                        {id: 'totalPaid', title: 'totalPaid'},
                        {id: 'remainingBalance', title: 'remainingBalance'},
                    ]});
                    await csvWriter.writeRecords(recordsToSave);
                }
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
