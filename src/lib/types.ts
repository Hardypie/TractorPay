export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  totalBilled: number;
  totalPaid: number;
  remainingBalance: number;
  jobCardNumber?: string;
  fatherOrHusbandName?: string;
  aadhaarNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  ifscCode?: string;
};

export type Payment = {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  method: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Check';
};

export type NewPayment = Omit<Payment, 'id'>;

export type Invoice = {
  id: string;
  customerId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'Paid' | 'Pending' | 'Overdue';
};

export type NewInvoice = Omit<Invoice, 'id'>;


export type BrandingSettings = {
  logo?: string;
  colors?: {
    primary?: string;
    secondary?: string;
  };
};
