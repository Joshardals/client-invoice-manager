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
