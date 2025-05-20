"use client";
import { useState, useCallback, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
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
import { AlertCircle, CheckCircle } from "lucide-react";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({
    type: null as "success" | "error" | null,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const submitAttemptRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const requestPasswordReset = useCallback(
    async (email: string, retryCount = 0) => {
      cleanup();
      abortControllerRef.current = new AbortController();

      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          signal: abortControllerRef.current.signal,
        });

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Failed to send reset instructions");
        return data;
      } catch (err) {
        if (
          err instanceof Error &&
          retryCount < MAX_RETRIES &&
          (err instanceof TypeError || err.name === "AbortError")
        ) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return requestPasswordReset(email, retryCount + 1);
        }
        throw err;
      }
    },
    [cleanup]
  );

  const onSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      if (submitAttemptRef.current) return;
      submitAttemptRef.current = true;

      try {
        // Clear the error parameter from URL when submitting
        startTransition(() => {
          router.replace("/forgot-password");
        });

        setLoading(true);
        setStatus({ type: null, message: "" });

        await requestPasswordReset(data.email.toLowerCase().trim());

        setStatus({
          type: "success",
          message:
            "If an account exists with this email, you will receive password reset instructions.",
        });
        reset();
      } catch (err) {
        console.error("Password reset error:", err);
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
    [requestPasswordReset, reset]
  );

  const handleLoginNavigation = useCallback(() => {
    startTransition(() => {
      router.push("/login");
    });
  }, [router]);

  const isLoading = loading;

  return (
    <>
      <motion.div
        {...formAnimations}
        className="w-full max-w-md space-y-6 xs:space-y-8 bg-white p-4 xs:p-6 md:p-8 rounded-xl shadow-lg"
      >
        <div className="space-y-1 xs:space-y-2">
          <h1 className="text-2xl xs:text-3xl font-bold text-gray-900">
            Reset Password
          </h1>
          <p className="text-xs xs:text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 xs:space-y-6"
          noValidate
        >
          <InputField
            label="Email Address"
            type="email"
            disabled={isLoading}
            {...register("email")}
            error={errors.email?.message}
          />

          <AnimatePresence mode="wait">
            {status.message && (
              <motion.div
                {...statusAnimations}
                className={`p-2 xs:p-3 rounded-lg ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                } text-xs xs:text-sm`}
              >
                {status.type === "success" && (
                  <CheckCircle className="size-3 xs:size-4 mr-1.5 sm:mr-2" />
                )}
                {status.type === "error" && (
                  <AlertCircle className="size-3 xs:size-4 mr-1.5 sm:mr-2" />
                )}
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 xs:space-y-4">
            <Button
              type="submit"
              loading={isLoading}
              disabled={!isValid || isLoading}
              className="w-full"
            >
              Send Reset Instructions
            </Button>

            <button
              type="button"
              onClick={handleLoginNavigation}
              disabled={isLoading}
              className="w-full text-xs xs:text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Login
            </button>
          </div>
        </form>
      </motion.div>
      <LoadingSpinner isPending={isPending} />
    </>
  );
}
