export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  name: string;
  error?: string;
  hintText?: string;
  currencySymbol?: string;
}
j;

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  name?: string;
  error?: string;
  disabled?: boolean;
  options: {
    value: string;
    label: string;
  }[];
}

// Types for Registration
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

// Types for Forms
export interface Status {
  type: "success" | "error" | "info" | "loading" | null;
  message: string;
}

// I used it in VerifyEmailForm and VerifyEmailPage
export interface VerificationData {
  email: string;
  verificationExpires: string | null;
}

// Type for the form input (with string dates)
export type InvoiceFormInput = {
  title: string;
  invoiceDate: string;
  dueDate: string;
  currency: "NGN" | "USD" | "GBP" | "EUR";
  clientId: string;
  description?: string;
  items: {
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
};

// Type for the processed data (with Date objects)
export type InvoiceData = {
  title: string;
  invoiceDate: Date;
  dueDate: Date;
  currency: "NGN" | "USD" | "GBP" | "EUR";
  clientId: string;
  description?: string;
  items: {
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
};

// Type for the All Clients Page
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  notes?: string | null;
}
