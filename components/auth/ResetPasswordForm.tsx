"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<{
    type: "success" | "error" | "loading" | null;
    message: string;
  }>({ type: null, message: "" });
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Validate token on mount
  useEffect(() => {
    async function validateToken() {
      try {
        const res = await fetch("/api/auth/validate-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const data = await res.json();
          setStatus({
            type: "error",
            message: data.error || "Invalid or expired reset link",
          });
          setTimeout(() => router.push("/forgot-password"), 3000);
        }
      } catch (error) {
        setStatus({
          type: "error",
          message: "Failed to validate reset token",
        });
      } finally {
        setValidatingToken(false);
      }
    }

    if (token) {
      validateToken();
    } else {
      setStatus({
        type: "error",
        message: "Missing reset token",
      });
      setTimeout(() => router.push("/forgot-password"), 3000);
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      setStatus({ type: "loading", message: "" });

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const responseData = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Password reset successful! Redirecting to login...",
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus({
          type: "error",
          message: responseData.error || "Failed to reset password",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600">Please enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            label="New Password"
            type="password"
            disabled={loading || status.type === "success"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
                message:
                  "Password must include at least 1 letter, 1 number, and 1 special character",
              },
            })}
            error={errors.password?.message}
          />

          <InputField
            label="Confirm Password"
            type="password"
            disabled={loading || status.type === "success"}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            error={errors.confirmPassword?.message}
          />

          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg ${
                status.type === "success"
                  ? "bg-green-50 text-green-700"
                  : status.type === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
              } text-sm flex items-center`}
            >
              {status.type === "success" && (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {status.message}
            </motion.div>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={!isValid || loading || status.type === "success"}
            className="w-full"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
