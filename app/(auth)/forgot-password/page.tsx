import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const errorMessages = {
    missing_token:
      "No reset token provided. Please request a new password reset.",
    invalid_token: "Invalid reset token. Please request a new password reset.",
    expired_token:
      "This reset link has expired. Please request a new password reset.",
    used_token:
      "This reset link has already been used. Please request a new password reset if needed.",
  };
  const errorMessage = error
    ? errorMessages[error as keyof typeof errorMessages]
    : null;

  return (
    <div className="">
      {error && (
        <div className="mb-4 px-8 py-4 bg-red-50 text-red-700 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}
      <ForgotPasswordForm />;
    </div>
  );
}
