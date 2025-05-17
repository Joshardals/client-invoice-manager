import * as z from "zod";
import { isPhoneValid } from "../utils";

const passwordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const passwordMessage =
  "Password must be at least 8 characters and include at least one letter, number, and special character";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
  email: z
    .string()
    .email("Please enter a valid email")
    .toLowerCase()
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
      "Include at least 1 letter, 1 number, and 1 special character"
    ),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(passwordPattern, passwordMessage),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Add clientSchema for adding client information
export const clientSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
  email: z
    .string()
    .email("Please enter a valid email")
    .toLowerCase()
    .max(255, "Email is too long"),
  phone: z
    .string()
    .transform((val) => val?.trim())
    .refine((val) => !val || isPhoneValid(val), {
      message: "Invalid phone number",
    })
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .max(100, "Company name is too long")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(200, "Address is too long")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type InvoiceFormInput = {
  title: string;
  invoiceDate: string; // Changed from Date to string
  dueDate: string; // Changed from Date to string
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

export const invoiceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.1, "Quantity must be greater than 0"),
  rate: z.number().min(1, "Rate must be greater than 0"),
  total: z.number(),
});

export const invoiceSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    invoiceDate: z.string(),
    dueDate: z.string(),
    currency: z.enum(["NGN", "USD", "GBP", "EUR"]),
    clientId: z.string().min(1, "Please select a client"),
    description: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, "Add at least one item"),
  })
  .refine((data) => new Date(data.dueDate) >= new Date(data.invoiceDate), {
    message: "Due date must be after or same as invoice date",
    path: ["dueDate"],
  })
  .refine((data) => data.items.reduce((sum, item) => sum + item.total, 0) > 0, {
    message: "Total invoice amount must be greater than 0",
    path: ["items"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
type ClientFormData = z.infer<typeof clientSchema>;
type InvoiceFormData = z.infer<typeof invoiceSchema>;

export type {
  RegisterFormData,
  LoginFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  ClientFormData,
  InvoiceFormData,
};
