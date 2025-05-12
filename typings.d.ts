export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  hintText?: string;
}

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
