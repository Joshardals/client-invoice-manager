"use client";
import React, {
  useState,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { useVerificationTimer } from "@/lib/hooks/useVerificationTimer";
import { useResendCooldown } from "@/lib/hooks/useResendCooldown";
import { Status, VerificationData } from "@/typings";
import { formAnimations, statusAnimations } from "@/lib/constants";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface VerifyEmailFormProps {
  sessionToken: string;
  initialData: VerificationData;
}

export function VerifyEmailForm({
  sessionToken,
  initialData,
}: VerifyEmailFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>(initialData.email);
  const [status, setStatus] = useState<Status>({ type: null, message: "" });

  const { timeRemaining, startTimer, isExpired } = useVerificationTimer(
    initialData.verificationExpires
  );
  const { cooldownTime, canResend, startCooldown } = useResendCooldown(60);

  const abortControllerRef = useRef<AbortController | null>(null);

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const handleRedirect = useCallback(
    (path: string, delay: number = 0) => {
      const timeoutId = setTimeout(() => {
        startTransition(() => {
          router.replace(path);
        });
      }, delay);
      return () => clearTimeout(timeoutId);
    },
    [router]
  );

  const verifySession = useCallback(async () => {
    if (!sessionToken) {
      handleRedirect("/register");
      return;
    }

    cleanup();
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("/api/auth/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error("Invalid session");
      }

      const data = await res.json();
      setUserEmail(data.email);
      startTimer(data.verificationExpires);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;

      setStatus({
        type: "error",
        message: "Session verification failed. Redirecting to registration...",
      });
      handleRedirect("/register", 2000);
    }
  }, [sessionToken, handleRedirect, cleanup, startTimer]);

  const handleResendCode = useCallback(async () => {
    if (!sessionToken || !canResend) return;

    cleanup();
    abortControllerRef.current = new AbortController();

    try {
      setResendLoading(true);
      setStatus({
        type: "loading",
        message: "Sending new verification code...",
      });

      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken }),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (response.ok) {
        startTimer(data.verificationExpires);
        startCooldown();
        setCode("");
        setStatus({
          type: "info",
          message: "New verification code sent to your email",
        });
      } else {
        throw new Error(data.error || "Failed to resend code");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;

      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to resend code",
      });
    } finally {
      setResendLoading(false);
    }
  }, [sessionToken, canResend, cleanup, startTimer, startCooldown]);

  const handleVerify = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isExpired) {
        setStatus({
          type: "error",
          message: "Verification code has expired. Please request a new one.",
        });
        return;
      }

      cleanup();
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setStatus({
          type: "loading",
          message: "Verifying code...",
        });

        const response = await fetch("/api/auth/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, sessionToken }),
          signal: abortControllerRef.current.signal,
        });

        const data = await response.json();

        if (response.ok) {
          setStatus({
            type: "success",
            message: "Email verified successfully! Redirecting to login...",
          });
          handleRedirect("/login", 3000);
        } else {
          throw new Error(data.error || "Invalid verification code");
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        setStatus({
          type: "error",
          message:
            error instanceof Error ? error.message : "Verification failed",
        });
      } finally {
        setLoading(false);
      }
    },
    [code, sessionToken, cleanup, handleRedirect, isExpired]
  );

  useEffect(() => {
    // Only verify session if we don't have initial data
    if (!initialData.verificationExpires) {
      verifySession();
    }
    return cleanup;
  }, [verifySession, cleanup, initialData.verificationExpires]);

  const isLoading = loading;

  return (
    <>
      <motion.div
        {...formAnimations}
        className="w-full max-w-md space-y-6 sm:space-y-8 bg-white p-4 xs:p-6 md:p-8 rounded-xl shadow-lg"
      >
        <div className="space-y-1 xs:space-y-2">
          <h1 className="text-2xl xs:text-3xl font-bold text-gray-900">
            Verify Your Email
          </h1>
          {userEmail && (
            <p className="text-xs xs:text-sm text-gray-600">
              We sent a verification code to {userEmail}
            </p>
          )}
          {timeRemaining > 0 && (
            <p className="text-xs xs:text-sm text-gray-500">
              Code expires in: {formatTime(timeRemaining)}
            </p>
          )}
          {isExpired && (
            <p className="text-xs xs:text-sm text-red-500">
              Code has expired. Please request a new one.
            </p>
          )}
        </div>

        <form onSubmit={handleVerify} className="space-y-4 xs:space-y-6">
          <div className="space-y-1 xs:space-y-2">
            <InputField
              label="Verification Code"
              name="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              disabled={isLoading || status.type === "success" || resendLoading}
            />
          </div>

          <AnimatePresence mode="wait">
            {status.message && (
              <motion.div
                {...statusAnimations}
                className={`p-2 xs:p-3 rounded-lg flex items-center ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700"
                    : status.type === "error"
                      ? "bg-red-50 text-red-700"
                      : status.type === "info"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-50 text-gray-700"
                } text-xs xs:text-sm`}
              >
                {status.type === "success" && (
                  <CheckCircle className="size-3 xs:size-4  mr-1.5 sm:mr-2" />
                )}
                {status.type === "error" && (
                  <AlertCircle className="size-3 xs:size-4  mr-1.5 sm:mr-2" />
                )}
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 xs:space-y-4">
            <Button
              type="submit"
              loading={loading}
              disabled={
                isLoading ||
                status.type === "success" ||
                code.length !== 6 ||
                isExpired ||
                resendLoading
              }
            >
              Verify Email
            </Button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend || resendLoading || isPending}
              className="w-full text-xs xs:text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canResend
                ? "Resend Code"
                : `Resend Code (${formatTime(cooldownTime)})`}
            </button>
          </div>
        </form>
      </motion.div>
      <LoadingSpinner isPending={isPending} />
    </>
  );
}
