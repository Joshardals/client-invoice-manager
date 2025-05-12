"use client";
import { useState, useCallback, useRef, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle } from "lucide-react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/form/validation";
import {
  formAnimations,
  MAX_RETRIES,
  RETRY_DELAY,
  statusAnimations,
} from "@/lib/constants";
import NavigationProgress from "../ui/NavigationProgress";
import { Status } from "@/typings";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({
    type: null,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [validatingToken, setValidatingToken] = useState(true);
  const submitAttemptRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const validateResetToken = useCallback(
    async (token: string, retryCount = 0) => {
      cleanup();
      abortControllerRef.current = new AbortController();

      try {
        const res = await fetch("/api/auth/validate-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Invalid or expired reset link");
        }
      } catch (err) {
        if (
          err instanceof Error &&
          retryCount < MAX_RETRIES &&
          (err instanceof TypeError || err.name === "AbortError")
        ) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return validateResetToken(token, retryCount + 1);
        }
        throw err;
      }
    },
    [cleanup]
  );

  const resetPassword = useCallback(
    async (data: { token: string; password: string }, retryCount = 0) => {
      cleanup();
      abortControllerRef.current = new AbortController();

      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: abortControllerRef.current.signal,
        });

        const responseData = await res.json();

        if (!res.ok)
          throw new Error(responseData.error || "Failed to reset password");
        return responseData;
      } catch (err) {
        if (
          err instanceof Error &&
          retryCount < MAX_RETRIES &&
          (err instanceof TypeError || err.name === "AbortError")
        ) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return resetPassword(data, retryCount + 1);
        }
        throw err;
      }
    },
    [cleanup]
  );

  useEffect(() => {
    async function validateToken() {
      try {
        if (!token) throw new Error("Missing reset token");
        await validateResetToken(token);
      } catch (err) {
        setStatus({
          type: "error",
          message:
            err instanceof Error
              ? err.message
              : "Failed to validate reset token",
        });
        startTransition(() => {
          setTimeout(() => router.push("/forgot-password"), 3000);
        });
      } finally {
        setValidatingToken(false);
      }
    }

    validateToken();

    return () => cleanup();
  }, [token, validateResetToken, router, cleanup]);

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      if (submitAttemptRef.current) return;
      submitAttemptRef.current = true;

      try {
        setLoading(true);
        setStatus({ type: "loading", message: "" });

        await resetPassword({ token, password: data.password });

        setStatus({
          type: "success",
          message: "Password reset successful! Redirecting to login...",
        });

        startTransition(() => {
          setTimeout(() => router.push("/login"), 3000);
        });
      } catch (err) {
        console.error("Reset password error:", err);
        setStatus({
          type: "error",
          message:
            err instanceof Error
              ? err.message
              : "Network error. Please try again.",
        });
      } finally {
        submitAttemptRef.current = false;
        setLoading(false);
      }
    },
    [token, resetPassword, router]
  );

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isLoading = loading || isPending;

  return (
    <>
      <motion.div
        {...formAnimations}
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600">Please enter your new password below.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <InputField
            label="New Password"
            type="password"
            disabled={isLoading || status.type === "success"}
            {...register("password")}
            error={errors.password?.message}
          />

          <InputField
            label="Confirm Password"
            type="password"
            disabled={isLoading || status.type === "success"}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <AnimatePresence mode="wait">
            {status.message && (
              <motion.div
                {...statusAnimations}
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
          </AnimatePresence>

          <Button
            type="submit"
            loading={isLoading}
            disabled={!isValid || isLoading || status.type === "success"}
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
      </motion.div>
      <LoadingSpinner isPending={isPending} />
    </>
  );
}
